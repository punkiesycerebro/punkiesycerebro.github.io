# Recuperación de una publicación de GitHub Pages

## Incidente del 6 de noviembre de 2026

La ejecución 42248080054 (#85) preparó correctamente el sitio, pero el paso
`deploy` agotó su tiempo de espera al activar la publicación. El reintento
solicitado quedó en estado `queued` y seguía así el 9 de noviembre. La interfaz
de GitHub rechazó la cancelación con el mensaje
`Cannot cancel a workflow run that is not in progress`.

- Ejecución afectada: https://github.com/punkiesycerebro/punkiesycerebro.github.io/actions/runs/42248080054
- Cambio pendiente: nuevo párrafo introductorio de Nuestra historia, integrado
  en `main` mediante el PR #44 (commit 38316d4a201c3e2bcc251fc3481a01eec60af52e).
- Última ejecución confirmada como exitosa antes del incidente: #84,
  https://github.com/punkiesycerebro/punkiesycerebro.github.io/actions/runs/42247604251

## Intento de recuperación

Este registro genera un nuevo commit en `main` para solicitar una publicación
nueva mediante el mecanismo habitual de GitHub Pages. No modifica el contenido
del sitio, sus recursos, el dominio, HTTPS ni la fuente de publicación.
El resultado debe comprobarse en Actions; crear el commit no garantiza que
GitHub haya publicado el sitio.

Si una nueva ejecución también queda bloqueada, conservar los enlaces de las
ejecuciones y solicitar asistencia a GitHub Support. No borrar el sitio ni
cambiar DNS como solución a este bloqueo. No repetir indefinidamente los
reintentos de una ejecución que sigue en cola.
