# 🏥 IN-MED - Sistema Web Inclusivo para Pacientes con Discapacidad Visual y Auditiva

Este es un sistema de gestión médica accesible, desarrollado como MVP (Producto Mínimo Viable), con enfoque en la atención de pacientes con discapacidad visual y auditiva. Diseñado para centros médicos y hospitales, IN-MED proporciona interfaces accesibles, rutas protegidas por rol y dashboards personalizados para tres tipos de usuarios: **Administradores**, **Secretarias** y **Médicos**.

---

## 🌐 Tecnologías Utilizadas

- **React.js** + Vite
- **React Router v6**
- **Context API** para autenticación
- **SweetAlert2** para mensajes emergentes
- **JWT** para protección de rutas y sesiones
- **TailwindCSS** (en parte) y estilos personalizados

---

## 📁 Estructura del Proyecto

sistema-inclusivo/
├── public/
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── DashboardAdmin.jsx
│   │   │   │   ├── VistaUsuarios.jsx
│   │   │   │   ├── VistaReportes.jsx
│   │   │   ├── secretaria/
│   │   │   │   ├── DashboardSecretaria.jsx
│   │   │   │   ├── VistaCitasSecretaria.jsx
│   │   │   ├── medico/
│   │   │   │   ├── DashboardMedico.jsx
│   │   │   │   ├── VistaCitasMedico.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DashboardLayout.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── FormularioPaciente.jsx
│   │   ├── VisorLlamados.jsx
│   ├── App.jsx
│   ├── main.jsx


---

## 👥 Roles y Permisos

### 🔐 Administrador
- Crear, editar y eliminar usuarios
- Gestionar pacientes y citas
- Acceso a reportes

### 📝 Secretaria
- Gestionar pacientes
- Crear y modificar citas

### 🩺 Médico
- Ver citas asignadas
- (Próximamente) Acceder a historial clínico

---

## 🧩 Rutas y Redirecciones

- `/login` → Página de autenticación
- `/dashboard/admin` → Dashboard de Administrador
- `/dashboard/secretaria` → Dashboard de Secretaria
- `/dashboard/medico` → Dashboard del Médico

Cada ruta se protege según el rol correspondiente, usando `RutaProtegida.jsx`.

---

## 🧠 Flujo de Autenticación

1. El usuario inicia sesión en `/login`
2. El backend responde con un **JWT**
3. El token se almacena en `localStorage`
4. El sistema redirige automáticamente según el rol:
   - `Administrador` → `/dashboard/admin`
   - `Secretaria` → `/dashboard/secretaria`
   - `Medico` → `/dashboard/medico`

---

## ⚙️ Instalación y Uso

# Instalar dependencias
cd sistema-inclusivo
npm install

# Iniciar servidor en desarrollo
npm run dev

---

## 🖌️ Estética y Accesibilidad
Diseño con layout tipo sidebar

Tipografía clara y moderna

Contraste visual adaptado a personas con baja visión

Soporte futuro para notificaciones visuales y táctiles

## 📌 Notas Adicionales
En proceso: módulo de historial clínico

Planificado: módulo de notificaciones vibratorias (vía hardware móvil)

---

## 🧑‍💻 Autor
Desarrollado por Felipe Andrés Parra Álvarez como parte del proyecto de título 2025, con el objetivo de mejorar la accesibilidad en entornos clínicos para personas sordas y ciegas.