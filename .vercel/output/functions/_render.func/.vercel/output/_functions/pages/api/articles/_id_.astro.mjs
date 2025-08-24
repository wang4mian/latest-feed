import { s as supabase } from '../../../chunks/supabase_Dfi1qjCo.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "文章ID不能为空"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: article, error } = await supabase.from("articles").select("*").eq("id", id).single();
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: article
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "未知错误"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
