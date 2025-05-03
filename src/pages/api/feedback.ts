import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { slug, type } = data;

    // Aquí procesamos el feedback sin utilizar la base de datos
    // Si no deseas almacenar datos, solo puedes retornar una respuesta simple

    if (!slug || (type && type !== "helpful" && type !== "notHelpful")) {
      return new Response(JSON.stringify({ helpful: 0, notHelpful: 0 }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    let updatedFeedback = { helpful: 0, notHelpful: 0 };

    if (type === "helpful") {
      updatedFeedback.helpful += 1;
    } else {
      updatedFeedback.notHelpful += 1;
    }

    return new Response(JSON.stringify(updatedFeedback), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error handling feedback:", error);
    return new Response("Internal server error", { status: 500 });
  }
};