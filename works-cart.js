// ==========================================
// WUKUWORK 收藏与购物车云端同步数据中心 (works-cart.js)
// ==========================================

var worksCart = {
  favorites: [],
  cart: [],
  currentUser: null,
  
  init: function() {
    this.injectStyles(); // 动态注入完美的实线和边缘对其样式
    this.loadFromStorage(); // 内部自动识别并同步本地与云端数据
    this.bindEvents();
    this.handleUrlRedirection(); // 启动一键跳转和弹窗自动拉起机制
  },
  
  loadFromStorage: async function() {
    var self = this;
    
    // 1. 先尝试读取本地 LocalStorage（作为基础）
    try {
      var savedFavorites = localStorage.getItem('works_favorites');
      var savedCart = localStorage.getItem('works_cart');
      this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    } catch(e) {
      this.favorites = [];
      this.cart = [];
    }

    // 2. 如果页面引入了 Supabase，我们尝试与云端进行实时同步与智能合并 (RULE 3)
    if (typeof _supabase !== 'undefined') {
      try {
        var { data: sessionData } = await _supabase.auth.getSession();
        if (sessionData && sessionData.session) {
          self.currentUser = sessionData.session.user;
          
          // 从云端 profiles 表中获取保存的收藏和购物车数据
          var { data: profile, error } = await _supabase
            .from('profiles')
            .select('favorites, cart')
            .eq('id', self.currentUser.id)
            .single();

          if (error) {
            console.error('Error fetching profile from cloud:', error);
          }

          if (!error && profile) {
            // --- 开启智能双向合并同步算法 ---
            var needSaveBack = false;

            // 2.1 合并并同步收藏夹 (Favorites)
            var dbFavs = profile.favorites || [];
            if (dbFavs.length > 0) {
              var combinedFavs = self.favorites.concat(dbFavs);
              var uniqueFavs = combinedFavs.filter(function(item, pos, arr) {
                var id = typeof item === 'object' ? item.id : item;
                return arr.findIndex(function(i) {
                  var compareId = typeof i === 'object' ? i.id : i;
                  return compareId === id;
                }) === pos;
              });
              if (uniqueFavs.length !== self.favorites.length || uniqueFavs.length !== dbFavs.length) {
                needSaveBack = true;
              }
              self.favorites = uniqueFavs;
            } else if (self.favorites.length > 0) {
              // 云端为空但本地有数据，需要将本地推上云端
              needSaveBack = true;
            }

            // 2.2 合并并同步购物车 (Cart)
            var dbCart = profile.cart || [];
            if (dbCart.length > 0) {
              dbCart.forEach(function(dbItem) {
                var localItem = self.cart.find(function(i) { return i.id === dbItem.id; });
                if (localItem) {
                  var oldQty = localItem.quantity || 1;
                  localItem.quantity = Math.max(oldQty, dbItem.quantity || 1);
                  if (localItem.quantity !== oldQty) needSaveBack = true;
                } else {
                  self.cart.push(dbItem);
                  needSaveBack = true;
                }
              });
            } else if (self.cart.length > 0) {
              // 云端为空但本地有数据，需要将本地推上云端
              needSaveBack = true;
            }

            // 2.3 执行回存，确保存储一致
            if (needSaveBack) {
              await self.saveToStorage();
            } else {
              localStorage.setItem('works_favorites', JSON.stringify(self.favorites));
              localStorage.setItem('works_cart', JSON.stringify(self.cart));
            }
          }
        }
      } catch (err) {
        console.error('Error syncing from Supabase cloud:', err);
      }
    }
    
    // 3. 刷新按钮及卡片数量状态
    this.updateButtonStates();
    if (typeof updateCartCounts === 'function') updateCartCounts();
    if (typeof renderCartList === 'function') renderCartList();
  },
  
  saveToStorage: async function() {
    var self = this;

    // 1. 严格排重：过滤掉重复商品
    this.favorites = this.favorites.filter(function(item, pos, self) {
      return self.findIndex(function(i) { return i.id === item.id; }) === pos;
    });
    this.cart = this.cart.filter(function(item, pos, self) {
      return self.findIndex(function(i) { return i.id === item.id; }) === pos;
    });

    // 2. 写入本地 LocalStorage 缓存
    localStorage.setItem('works_favorites', JSON.stringify(this.favorites));
    localStorage.setItem('works_cart', JSON.stringify(this.cart));

    // 3. 如果用户已登录，同步将最新数据更新到云端 profiles 表
    if (self.currentUser && typeof _supabase !== 'undefined') {
      try {
        var { error } = await _supabase.from('profiles').update({
          favorites: self.favorites,
          cart: self.cart,
          updated_at: new Date().toISOString()
        }).eq('id', self.currentUser.id);
        
        // 【关键调试点】：如果写入数据库失败，强制在控制台打印出具体 RLS 策略或格式错误信息！
        if (error) {
          console.error('Supabase cloud save error details:', error);
        }
      } catch (err) {
        console.error('Error uploading state to cloud:', err);
      }
    }

    // 4. 通知页面刷新计数
    this.updateButtonStates();
    if (typeof updateCartCounts === 'function') updateCartCounts();
  },
  
  bindEvents: function() {
    var self = this;
    
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        self.setupModalButtons();
        self.updateButtonStates();
      }, 100);
    });

    // 监听商品卡片的点击事件
    document.querySelectorAll('.work-label').forEach(function(label) {
      label.addEventListener('click', function() {
        setTimeout(function() {
          self.updateButtonStates();
        }, 100);
      });
    });
  },
  
  setupModalButtons: function() {
    var btnFavorite = document.getElementById('btnFavorite');
    var btnCart = document.getElementById('btnCart');
    
    if (btnFavorite && btnCart) {
      btnFavorite.style.cursor = 'none';
      btnCart.style.cursor = 'none';

      var newFavorite = btnFavorite.cloneNode(true);
      var newCart = btnCart.cloneNode(true);

      btnFavorite.parentNode.replaceChild(newFavorite, btnFavorite);
      btnCart.parentNode.replaceChild(newCart, btnCart);

      var self = this;
      newFavorite.addEventListener('click', function(e) {
        e.stopPropagation();
        self.toggleFavorite();
      });
      newCart.addEventListener('click', function(e) {
        e.stopPropagation();
        self.toggleCart();
      });

      if (typeof bindHover === 'function') {
        bindHover(newFavorite);
        bindHover(newCart);
      }
    }
  },
  
  getCurrentWorkItem: function() {
    var modalTitle = document.getElementById('modalTitle');
    if (!modalTitle) return null;
    
    var titleText = modalTitle.innerText || modalTitle.textContent;
    var category = titleText.split('\n')[0].replace('*', '').trim();
    var title = titleText.split('\n')[1].replace('<', '').replace('>', '').trim();
    
    var items = document.querySelectorAll('.work-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.title === title && items[i].dataset.category === category) {
        return items[i];
      }
    }
    return null;
  },
  
  getWorkData: function(item) {
    if (!item) item = this.getCurrentWorkItem();
    if (!item) return null;
    
    return {
      id: item.dataset.id,
      category: item.dataset.category,
      title: item.dataset.title,
      image: item.querySelector('img').src,
      modalImages: JSON.parse(item.dataset.modalImages || '[]')
    };
  },
  
  isFavorite: function(workId) {
    return this.favorites.some(function(item) { return item.id === workId; });
  },

  isInCart: function(workId) {
    return this.cart.some(function(item) { return item.id === workId; });
  },
  
  toggleFavorite: function() {
    var workData = this.getWorkData();
    if (!workData) return;
    
    var index = this.favorites.findIndex(function(item) { return item.id === workData.id; });
    
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(workData);
    }
    
    this.saveToStorage();
    this.updateButtonStates();
  },
  
  toggleCart: function() {
    var workData = this.getWorkData();
    if (!workData) return;
    
    var index = this.cart.findIndex(function(item) { return item.id === workData.id; });
    
    if (index > -1) {
      this.cart.splice(index, 1);
    } else {
      workData.quantity = 1;
      workData.selected = true; // 确保新加购的商品默认属于勾选状态
      this.cart.push(workData);
    }
    
    this.saveToStorage();
    this.updateButtonStates();
  },

  silentAddToCart: function() {
    var workData = this.getWorkData();
    if (!workData) return;
    
    var existingItem = this.cart.find(function(item) { return item.id === workData.id; });
    if (!existingItem) {
      workData.quantity = 1;
      workData.selected = true; // 确保默认属于勾选状态
      this.cart.push(workData);
      this.saveToStorage();
      this.updateButtonStates();
    }
  },
  
  updateButtonStates: function() {
    var btnFavorite = document.getElementById('btnFavorite');
    var btnCart = document.getElementById('btnCart');
    var workData = this.getWorkData();
    
    if (workData) {
      this.injectPurchaseComponent(workData);
    }
    
    if (btnFavorite && workData) {
      if (this.isFavorite(workData.id)) {
        btnFavorite.innerHTML = '<svg viewBox="0 0 24 24" fill="#040000" stroke="#040000" stroke-width="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      } else {
        btnFavorite.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#040000" stroke-width="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      }
    }

    if (btnCart && workData) {
      if (this.isInCart(workData.id)) {
        btnCart.innerHTML = '<svg viewBox="0 0 24 24" fill="#040000" stroke="#040000" stroke-width="1.5"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>';
      } else {
        btnCart.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#040000" stroke-width="1.5"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>';
      }
    }
  },

  injectStyles: function() {
    var styleId = 'wuku-buy-now-styles';
    if (document.getElementById(styleId)) return;
    
    var style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      #modalBuyNowComponent {
        border-top: 2px solid #000000 !important;
        padding: 20px 24px;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        background: #fff;
        flex-shrink: 0;
        width: 100%;
      }
      @media (max-width: 768px) {
        #modalBuyNowComponent {
          padding: 16px;
          gap: 20px;
        }
      }
      @media (max-width: 480px) {
        #modalBuyNowComponent {
          padding: 12px;
          gap: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  },

  injectPurchaseComponent: function(workData) {
    var modalContainer = document.querySelector('.modal-container');
    if (!modalContainer || !workData) return;
    
    var oldComponent = document.getElementById('modalBuyNowComponent');
    if (oldComponent) oldComponent.remove();
    
    var prices = {
      "1": "¥120",
      "2": "¥188",
      "3": "¥240",
      "4": "¥320",
      "5": "¥150",
      "6": "¥45"
    };
    var priceVal = prices[workData.id] || "¥100";

    var div = document.createElement('div');
    div.id = 'modalBuyNowComponent';
    div.innerHTML = `
      <div style="display: flex; flex-direction: column; justify-content: center; gap: 4px; flex-shrink: 0; line-height: 1;">
        <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 400; color: #666; letter-spacing: 0.5px;">PRICE:</span>
        <div style="display: flex; align-items: baseline; gap: 3px; margin-top: 4px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 10px; color: #666; font-weight: 400;">RMB</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 500; color: #000; letter-spacing: -0.5px;">${priceVal}</span>
        </div>
      </div>
      <button id="modalBuyNowBtn" style="flex: 1; height: 48px; border: 2px solid #000; background: #000; color: #fff; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 400; letter-spacing: 1px; cursor: none !important; transition: 0.2s; display: flex; align-items: center; justify-content: center;">BUY NOW</button>
    `;
    
    modalContainer.appendChild(div);
    
    var btn = document.getElementById('modalBuyNowBtn');
    if (btn) {
      if (typeof bindHover === 'function') bindHover(btn);
      
      btn.addEventListener('mouseenter', function() {
        btn.style.backgroundColor = '#fff';
        btn.style.color = '#000';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.backgroundColor = '#000';
        btn.style.color = '#fff';
      });
      
      var self = this;
      btn.addEventListener('click', function() {
        self.silentAddToCart(); // 静默加购
        window.location.href = 'profile.html?open=cart'; // 立即跳转并唤起结算
      });
    }
  },

  handleUrlRedirection: function() {
    var urlParams = new URLSearchParams(window.location.search);
    var targetId = urlParams.get('id');
    
    if (targetId) {
      setTimeout(function() {
        var workCard = document.querySelector('.work-item[data-id="' + targetId + '"]');
        if (workCard) {
          var label = workCard.querySelector('.work-label');
          if (label) {
            label.click();
          }
        }
      }, 300);
    }
  },
  
  getFavorites: function() {
    return this.favorites;
  },
  
  getCart: function() {
    return this.cart;
  },
  
  removeFromFavorites: function(workId) {
    this.favorites = this.favorites.filter(function(item) { return item.id !== workId; });
    this.saveToStorage();
  },
  
  removeFromCart: function(workId) {
    this.cart = this.cart.filter(function(item) { return item.id !== workId; });
    this.saveToStorage();
  },
  
  updateCartQuantity: function(workId, quantity) {
    var item = this.cart.find(function(i) { return i.id === workId; });
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(workId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
      }
    }
  },
  
  clearCart: function() {
    this.cart = [];
    this.saveToStorage();
  }
};

worksCart.init();