const WHATSAPP_URL = 'https://wa.me/message/HLJIV7IE6GKAG1?text=Hello%20Tochiwears%2C%20I%20want%20to%20place%20an%20order.'

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Tochiwears on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1EBE57]"
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M19.05 4.95A9.9 9.9 0 0 0 12 2a9.9 9.9 0 0 0-7.05 16.95L2 22l3.2-1.02A9.9 9.9 0 0 0 12 22a9.9 9.9 0 0 0 7.05-16.95ZM12 19.4a8.1 8.1 0 0 1-4.1-1.12l-.29-.17-1.9.61.63-1.85-.19-.3A8.1 8.1 0 1 1 12 19.4Zm4.46-6.15c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.58.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
      </svg>
    </a>
  )
}

export default WhatsAppButton
