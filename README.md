# API for Authentication

- This is a readme with all routes

## Auth Routes

### POST ```/api/v1/auth/login```

- method must include a user and password
- method return a BASE64 token with this information:
- ```{ "name": ..., "email": ..., "roles": ..., "expiration":... }```


## Endpoint: `/api/v1/users/bulkCreate`

# Para poder crear un usuario en el bulkcreat debe tener el siguiente formato:
```
{
    "Users":[
        {
            "name": "ignacio",
            "email": "ignacio@example.com",
            "password": "ulegos12345",
            "cellphone": "11223344"
        }

    ]

} 
```

## Endpoint: `/api/v1/users/findUsers`

### Parámetros de Consulta
- **name**: (Opcional) Un nombre parcial o completo para buscar usuarios. Los usuarios cuyos nombres contengan esta cadena se incluirán en los resultados.
  - Ejemplo: `name=Juan`

- **deleted**: (Opcional) Un valor booleano (`true` o `false`) que indica si se deben incluir usuarios eliminados en los resultados. `true` incluirá solo usuarios eliminados, y `false` incluirá solo usuarios no eliminados.
  - Ejemplo: `deleted=false`
  
- **loginBefore**: (Opcional) Una fecha en el formato `YYYY-MM-DD`. Los usuarios que hayan iniciado sesión antes de esta fecha se incluirán en los resultados.
  - Ejemplo: `loginBefore=2024-06-10`

- **loginAfter**: (Opcional) Una fecha en el formato `YYYY-MM-DD`. Los usuarios que hayan iniciado sesión después de esta fecha se incluirán en los resultados.
  - Ejemplo: `loginAfter=2024-06-01`


