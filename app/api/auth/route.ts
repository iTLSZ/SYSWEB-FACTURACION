import { Console } from 'console'
import { NextRequest, NextResponse } from 'next/server'

// Deshabilitar verificación SSL en desarrollo (solo para testing)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

interface AuthRequest {
  username: string
  password: string
}

interface TokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface UserValidationResponse {
  success: boolean
  message: string
  data?: any
}

// Función para obtener el token de autenticación
async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('https://webcer.copetran.com.co/nuevo/api_gen_tok.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: 'copetran2025',
        password: 'Copetran.2025',
        scope: 'sysweb_accesos',
        client_id: 'webcer002',
        client_secret: 'Jsoncopetran',
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    console.log('Respuesta del token:', text)
    
    try {
      const data: TokenResponse = JSON.parse(text)
      if (data.error) {
        console.error('Error obteniendo token:', data.error_description || data.error)
        return null
      }
      return data.access_token || null
    } catch (parseError) {
      // Si no es JSON, asumir que el texto es el token
      console.log('La respuesta no es JSON, asumiendo que es el token:', text)
      return text.trim() || null
    }
  } catch (error) {
    console.error('Error en getAuthToken:', error)
    return null
  }

  
}

// Función para validar las credenciales del usuario usando Node.js HTTPS
async function validateUser(username: string, password: string, token: string): Promise<UserValidationResponse> {
  return new Promise((resolve) => {
    try {
      const https = require('https')
      
      // Formatear los datos como en el ejemplo original
      const formattedUsername = username.padEnd(20)
      const formattedPassword = password.padEnd(20)
      const postData = `${formattedUsername}${formattedPassword}`

      console.log('Longitud de los datos formateados:', formattedUsername.length);
      console.log('Longitud de los datos formateados:', formattedPassword.length);
      console.log('Datos formateados:', postData)
      console.log('Longitud de los datos formateados:', postData.length);
      console.log('Token usado:', token)
      console.log('usuario:', postData.substring(0, 20));
      console.log('contraseña:', postData.substring(20, 40));


      const options = {
        method: 'GET',
        hostname: 'webcer.copetran.com.co',
        path: '/nuevo/api_val_user.php/',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(postData)
        },
        maxRedirects: 20,
        rejectUnauthorized: false // Para manejar SSL
      }

      const req = https.request(options, function (res: any) {
        let chunks: any[] = []

        res.on("data", function (chunk: any) {
          chunks.push(chunk)
        })

        res.on("end", function () {
          const body = Buffer.concat(chunks)
          const responseText = body.toString()
          console.log('Respuesta de validación:', responseText)

          try {
            // Intentar parsear como JSON
            const jsonResponse = JSON.parse(responseText)
            console.log('JSON parseado:', jsonResponse)
            console.log('Indicador recibido:', jsonResponse.indicador)
            // Verificar el indicador de la respuesta
            if (jsonResponse.indicador >= 1) {
              // Código 1 o mayor = acceso permitido
              resolve({
                success: true,
                message: '¡Bienvenido al sistema COPETRAN! Credenciales válidas.',
                data: jsonResponse
              })
            } else if (jsonResponse.indicador < 0) {
              // Código menor a 0 = acceso denegado
              resolve({
                success: false,
                message: jsonResponse.descrip || 'Credenciales inválidas o usuario no existe.',
                data: jsonResponse
              })
            } else {
              // Código 0 = caso especial
              resolve({
                success: false,
                message: jsonResponse.descrip || 'Acceso denegado.',
                data: jsonResponse
              })
            }
          } catch (parseError) {
            console.log('No es JSON válido, procesando como texto plano')
            
            // Fallback para respuestas que no son JSON
            const numericValue = parseInt(responseText.trim())
            if (!isNaN(numericValue)) {
              if (numericValue >= 1) {
                resolve({
                  success: true,
                  message: '¡Bienvenido al sistema COPETRAN! Credenciales válidas.',
                  data: responseText
                })
              } else {
                resolve({
                  success: false,
                  message: 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.',
                  data: responseText
                })
              }
            } else {
              resolve({
                success: false,
                message: `Respuesta inesperada del servidor: ${responseText}`,
                data: responseText
              })
            }
          }
        })

        res.on("error", function (error: any) {
          console.error('Error en respuesta:', error)
          resolve({
            success: false,
            message: 'Error de conexión con el servidor.',
          })
        })
      })

      req.on('error', function (error: any) {
        console.error('Error en request:', error)
        resolve({
          success: false,
          message: 'Error de conexión con el servidor.',
        })
      })

      // Escribir los datos en el request
      req.write(postData)
      req.end()

    } catch (error) {
      console.error('Error en validateUser:', error)
      resolve({
        success: false,
        message: 'Error del servidor. Por favor, intenta más tarde.',
      })
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { username, password }: AuthRequest = await request.json()

    // Validar que se enviaron los datos requeridos
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Obtener token de autenticación
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Error obteniendo token de autenticación' },
        { status: 500 }
      )
    }

    // Validar credenciales del usuario
    const result = await validateUser(username, password, token)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error en API de autenticación:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}