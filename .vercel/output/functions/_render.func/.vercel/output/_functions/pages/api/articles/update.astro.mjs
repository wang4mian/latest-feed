import { s as supabase } from '../../../chunks/supabase_X1KeQV3a.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status, editor_action, final_content } = body;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "文章ID不能为空"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updateData = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (status !== void 0) updateData.status = status;
    if (editor_action !== void 0) updateData.editor_action = editor_action;
    if (final_content !== void 0) updateData.final_content = final_content;
    if (editor_action === "compiled") {
      updateData.processed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    const { data, error } = await supabase.from("articles").update(updateData).eq("id", id).select().single();
    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
