import Image from "next/image"; // Componente nativo para optimizar el rendimiento

export function Footer() {
  return (
    <footer className="py-12 bg-bg-main dark:bg-bg-darker border-t border-border dark:border-border-dark text-center">
      {/* Contenedor relativo para alojar la imagen optimizada con dimensiones fijas */}
      <div className="relative h-10 w-32 mx-auto mb-4 hover:scale-105 transition-transform duration-300">
        <Image
          src="/icons/neo_logo_negro.svg" // Corregido: Ruta absoluta desde la raíz de public
          alt="NEO Logo"
          fill
          sizes="128px"
          className="object-contain dark:invert transition-colors duration-300"
        />
      </div>
      <p className="text-text-muted text-sm">
        © 2026 Estudio Camaleón. Todos los derechos reservados.
      </p>
    </footer>
  );
}
