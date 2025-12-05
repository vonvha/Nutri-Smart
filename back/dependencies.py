from fastapi import Header, HTTPException, status

async def get_current_user_email(authorization: str = Header(None)):
    """
    Extrae el email del usuario desde el 'fake token' enviado por el frontend.
    Formato esperado header: 'Bearer email@dominio.com-fake-jwt-token'
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Se requiere autenticación",
        )
    
    try:
        # El frontend envía "Bearer <token>"
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Esquema de autenticación inválido",
            )
            
        # Nuestra lógica de token fake en auth.py era: f"{email}-fake-jwt-token"
        # Así que para recuperar el email, quitamos el sufijo.
        email = token.replace("-fake-jwt-token", "")
        return email
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o mal formado",
        )