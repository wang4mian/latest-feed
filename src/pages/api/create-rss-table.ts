import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const POST: APIRoute = async () => {
  try {
    console.log('[DB-Setup] Creating rss_items table...')

    // 使用原生SQL创建表
    const { data, error } = await supabase.from('_test').select('*').limit(1)
    
    // 直接执行SQL创建表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.rss_items (
        id text PRIMARY KEY,
        rss_source_id text NOT NULL,
        title text NOT NULL,
        link text NOT NULL,
        description text,
        pub_date timestamptz,
        guid text,
        processed boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
      
      CREATE INDEX IF NOT EXISTS idx_rss_items_source_id ON rss_items(rss_source_id);
      CREATE INDEX IF NOT EXISTS idx_rss_items_processed ON rss_items(processed);
      CREATE INDEX IF NOT EXISTS idx_rss_items_created_at ON rss_items(created_at DESC);
    `

    // 通过Supabase service执行SQL
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({
        sql: createTableSQL
      })
    })

    if (!response.ok) {
      // 如果RPC不可用，尝试手动创建一条记录来触发表创建
      console.log('[DB-Setup] Trying manual table creation...')
      
      const testRecord = {
        id: 'test_' + Date.now(),
        rss_source_id: 'test',
        title: 'Test RSS Item',
        link: 'https://test.com',
        description: 'Test description',
        pub_date: new Date().toISOString(),
        guid: 'test_guid_' + Date.now(),
        processed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // 尝试插入测试记录（这会自动创建表）
      const { data: insertData, error: insertError } = await supabase
        .from('rss_items')
        .insert([testRecord])
        .select()
        
      if (insertError) {
        console.error('[DB-Setup] Insert error:', insertError)
        throw insertError
      }
      
      // 删除测试记录
      await supabase
        .from('rss_items')
        .delete()
        .eq('id', testRecord.id)
    }

    console.log('[DB-Setup] rss_items table created successfully!')

    return new Response(JSON.stringify({
      success: true,
      message: 'rss_items table created successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[DB-Setup] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Table creation failed',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}