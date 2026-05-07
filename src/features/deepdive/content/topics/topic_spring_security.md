# Spring Security: filter chain, AuthenticationManager, JWT, OAuth2, CSRF, CORS

Spring Security is a filter chain before your controllers. Filters extract credentials, authenticate, set the security context, authorize access, and handle failures.

`AuthenticationManager` verifies credentials and returns an authenticated principal. For JWT-based APIs, a filter validates the token and builds authentication from claims. For OAuth2, the app delegates identity to an authorization server and consumes tokens.

CSRF protects browser-based state-changing requests that rely on cookies. Token-based APIs used by non-browser clients often disable CSRF, but cookie-authenticated browser apps should treat it seriously.

CORS is a browser policy. The backend must explicitly allow origins, methods, headers, and credentials. CORS is not authentication; it only controls which browser origins may read responses.
