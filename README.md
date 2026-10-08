# Developer Portfolio

Fundația aplicației personale `horatiutibrea.ro`, păstrată intenționat mică înainte de dezvoltarea paginilor de portofoliu.

## Structură

```text
developer-portfolio/
├── src/
│   ├── Portfolio.Api/
│   └── Portfolio.Web/
├── tests/
│   └── Portfolio.Api.Tests/
└── Portfolio.sln
```

Backend-ul este un ASP.NET Core Web API pe .NET 10. Frontend-ul este React, TypeScript, Vite și MUI. În producție, frontend-ul este construit separat și apelează API-ul prin URL-uri relative `/api/*`; API-ul nu găzduiește fișierele React.

## Capabilități curente

- autentificare Google pentru orice cont cu adresă de e-mail verificată;
- sesiune JWT păstrată într-un cookie `Secure` și `HttpOnly`;
- utilizatori, roluri `ADMIN`/`SUPERADMIN` și autorizare;
- protecție CSRF/antiforgery și rate limiting pentru autentificare;
- EF Core cu Microsoft SQL Server și migrations existente;
- Swagger/OpenAPI numai în Development;
- exception handling global, correlation ID și security headers;
- răspunsuri comprimate și health checks;
- shell React responsiv, temă MUI light/dark, localizare și zona de administrare a utilizatorilor.

Paginile finale Home, About, Experience, Projects, Contact și Privacy/GDPR nu sunt încă implementate.

## Configurare backend

Configurația este încărcată din `appsettings.json`, fișierul mediului curent și variabile de mediu. Valorile sensibile trebuie furnizate în afara repository-ului.

Variabile uzuale:

```text
ConnectionStrings__SQLConnection
AuthSettings__SecretKey
AuthSettings__GoogleClientId
DataProtection__KeysPath
```

Factory-ul EF Core design-time folosește aceleași surse, astfel încât variabile precum `ConnectionStrings__SQLConnection` suprascriu valorile JSON pentru `dotnet ef database update` și `dotnet ef migrations script`.

## Configurare frontend

`src/Portfolio.Web/src/config/config.production.json` păstrează `serverUrl` gol pentru same-origin. Development folosește backend-ul local. ID-ul clientului Google este furnizat prin `VITE_GOOGLE_AUTH_CLIENT_ID`.

## Health checks

- `GET /health` — liveness al procesului, fără autentificare și fără verificarea dependențelor;
- `GET /health/ready` — verifică exclusiv conectivitatea SQL Server, fără autentificare.

## Comenzi de validare

Din rădăcina repository-ului:

```powershell
dotnet restore Portfolio.sln
dotnet build Portfolio.sln -c Release
dotnet test Portfolio.sln -c Release
```

Pentru frontend:

```powershell
Set-Location src/Portfolio.Web
npm ci
npm run lint
npm test -- --run
npm run build
```

## Publicare

Un push pe ramura `main` pornește workflow-ul `.github/workflows/publish.yml`. Acesta rulează testele, construiește API-ul și frontend-ul, apoi înlocuiește versiunea de pe server. Publicarea folosește cheia din secretul `DEPLOY_SSH_KEY`. Parola bazei de date și secretul JWT rămân doar pe server.
