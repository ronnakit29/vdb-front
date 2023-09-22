import React from 'react'

export default function SupportProgram() {
  return (
    <div className="fixed bottom-1 z-[999] border border-teal-500 text-teal-600 py-1 shadow-lg right-0 px-3 bg-white rounded-full flex gap-2 items-center">
        <div>
            <a href="/support.zip" className="underline">Smartcard Reader</a>
        </div>
        /
        <div>
            <a href="/nvm-setup.exe" className="underline">Runtime</a>
        </div>
    </div>
  )
}
