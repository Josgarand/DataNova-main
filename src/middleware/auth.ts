// import { defineMiddleware } from "astro/middleware";

// export const onRequest = defineMiddleware(async (context, next) => {
//   const url = new URL(context.request.url);

//   // Protege solo la ruta /controlPanel
//   if (url.pathname.startsWith("/controlPanel")) {
//     const res = await fetch("http://localhost:8080/auth/check", {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         cookie: context.request.headers.get("cookie") ?? "",
//       },
//     });

//     if (!res.ok) {
//       return Response.redirect("http://localhost:4321/login", 302);
//     }
//   }

//   return next();
// });