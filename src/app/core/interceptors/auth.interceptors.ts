// import type { HttpInterceptorFn } from "@angular/common/http"
// import { inject } from "@angular/core"
// import { Router } from "@angular/router"
// import { catchError, throwError } from "rxjs"

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router)
//   const token = localStorage.getItem("token")

//   // Ajouter le token d'authentification si disponible
//   if (token && !req.url.includes("/auth/")) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//   }

//   return next(req).pipe(
//     catchError((error) => {
//       // Rediriger vers la page de connexion si non autorisé
//       if (error.status === 401) {
//         localStorage.removeItem("token")
//         localStorage.removeItem("currentUser")
//         router.navigate(["/auth/login"])
//       }
//       return throwError(() => error)
//     }),
//   )
// }
