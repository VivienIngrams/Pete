'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useLanguage } from './context/LanguageProvider'
import ReCAPTCHA from 'react-google-recaptcha'

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''


const languageTexts = {
  en: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    recaptchaError:
      'Please complete the reCAPTCHA verification before submitting.',
    formSuccess: 'Message successfully sent',
    formError: 'Error, please try resubmitting the form',
    copyrightNotice:
      'All images are subject to copyright, and any use or reproduction requires authorization.',
  },
  fr: {
    name: 'Nom',
    email: 'Courriel',
    subject: 'Sujet',
    message: 'Message',
    sendMessage: 'Envoyer',
    recaptchaError:
      "Veuillez compléter la vérification reCAPTCHA avant d'envoyer.",
    formSuccess: 'Message envoyé avec succès',
    formError: "Erreur, veuillez réessayer d'envoyer le formulaire",
  },
}

const ContactForm: React.FC = () => {
  const { language: activeLang } = useLanguage()
  const texts = languageTexts[activeLang] || languageTexts.en
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCaptchaChange = (token: string | null) => {
    setIsVerified(!!token)
  }

  const handleCaptchaExpired = () => setIsVerified(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isVerified) {
      alert(texts.recaptchaError)
      return
    }

    const formData = new FormData(event.currentTarget)
    const token = recaptchaRef.current?.getValue() || null

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`)

      alert(texts.formSuccess)
      recaptchaRef.current?.reset()
      setIsVerified(false)
    } catch (error) {
      console.error(error)
      alert(texts.formError)
    }
  }

  return (
    <form
      method="post"
      action="/api"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="font-roboto w-full"
    >
      <div className="flex flex-col">
        <label htmlFor="name" className=" text-sm py-1">
          {texts.name}
        </label>
        <input
          id="name"
          autoFocus={false}
          name="name"
          autoComplete="off"
          required
          minLength={3}
          maxLength={150}
          className=" border-[1px] rounded border-gray-300 p-1"
          type="text"
        />
      </div>

      <div className="flex flex-col py-1">
        <label htmlFor="email" className=" text-sm py-1">
          {texts.email}
        </label>
        <input
          id="email"
          name="email"
          autoComplete="off"
          required
          minLength={8}
          maxLength={150}
          className=" border-[1px] rounded border-gray-300 p-1"
          type="email"
        />
      </div>

      <div className="flex flex-col py-1">
        <label htmlFor="subject" className=" text-sm py-1">
          {texts.subject}
        </label>
        <input
          id="subject"
          name="subject"
          autoComplete="off"
          className=" border-[1px] rounded border-gray-300 p-1"
          type="text"
        />
      </div>

      <div className="flex flex-col py-1">
        <label htmlFor="message" className=" text-sm py-1">
          {texts.message}
        </label>
        <textarea
          id="message"
          name="message"
          autoComplete="off"
          required
          minLength={20}
          maxLength={600}
          className=" border-[1px] rounded border-gray-300 p-1"
          rows={5}
        />
      </div>

      {/* Copyright Notice */}
      <p className="  pt-4">
        {texts.copyrightNotice}
      </p>

      <div className="md:grid grid-cols-2">
        <div className="flex flex-col py-4">
          <ReCAPTCHA
            sitekey={siteKey}
            ref={recaptchaRef}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
        </div>
        <div className="flex md:items-start md:justify-end">
          <button
            type="submit"
            className=" mb-20 md:mt-4 text-gray-700 hover: hover:scale-105 ease-in duration-600 border-[1px] border-gray-300 rounded-lg shadow-md p-2 "
            disabled={!isVerified}
          >
            {texts.sendMessage}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ContactForm

