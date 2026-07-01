const supabaseUrl = 'https://qrfflkfcmiybgtcysupg.supabase.co';
const supabaseKey = 'sb_publishable_WxEHfw7blMpchHp7EZOrRw_gGGQyo2H';

// 增加了 auth: { flowType: 'implicit' } 配置，解决跨设备重置链接失效的问题
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'implicit'
  }
});