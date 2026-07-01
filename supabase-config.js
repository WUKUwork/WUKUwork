const supabaseUrl = 'https://qrfflkfcmiybgtcysupg.supabase.co';
const supabaseKey = 'sb_publishable_WxEHfw7blMpchHp7EZOrRw_gGGQyo2H';

// 【修改后】使用 var 声明并将客户端直接挂载在 window.supabase 上，确保所有外部 JS（包括 works-cart.js）都能 100% 稳定读取它
var _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'implicit'
  }
});
window._supabase = _supabase;