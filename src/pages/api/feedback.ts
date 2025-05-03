import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";  // Aquí estamos importando el cliente de Prisma

// Instanciamos el cliente de Prisma
const prisma = new PrismaClient();

/**
 * Handles POST requests to submit or retrieve feedback data for a specific `slug`.
 *
 * The function processes the request body to extract the `slug` and optional `type` values.
 * If `slug` is missing or `type` is invalid, it retrieves existing feedback data for the `slug`.
 * If a valid `type` is provided ("helpful" or "notHelpful"), it updates the feedback data
 * by incrementing the respective count.
 *
 * Returns the feedback data in JSON format with appropriate success or error response status.
 *
 * @param {Object} request An object representing the request data.
 * @returns {Promise<Response>} A Response object containing the feedback data or error message.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { slug, type } = data;

    // Verificar que el 'slug' existe y que 'type' sea válido si se proporciona
    if (!slug || (type && type !== "helpful" && type !== "notHelpful")) {
      // Si no hay 'type', retornar los datos existentes de feedback
      const feedback = await prisma.feedback.findFirst({
        where: { slug },
      });

      return new Response(JSON.stringify(feedback || { helpful: 0, notHelpful: 0 }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Si 'type' existe, manejar la sumatoria de feedback
    let updatedFeedback;

    if (type === "helpful") {
      updatedFeedback = await prisma.feedback.upsert({
        where: { slug },
        update: { helpful: { increment: 1 } },
        create: { slug, helpful: 1, notHelpful: 0 },
      });
    } else {
      updatedFeedback = await prisma.feedback.upsert({
        where: { slug },
        update: { notHelpful: { increment: 1 } },
        create: { slug, helpful: 0, notHelpful: 1 },
      });
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
  } finally {
    await prisma.$disconnect(); // Cerramos la conexión a la base de datos
  }
};