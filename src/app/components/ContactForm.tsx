'use client'

import React, { useRef, useState, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

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
    copyrightNotice:
      'Toutes les images sont soumises au droit d’auteur, et toute utilisation ou reproduction nécessite une autorisation.',
  },
}

const ContactForm: React.FC<{ language: string }> = ({ language }) => {
  const texts = languageTexts[language] || languageTexts.en
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCaptchaChange = (token: string | null) => {
    if (token) setIsVerified(true)
    else setIsVerified(false)
  }

  const handleCaptchaExpired = () => setIsVerified(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isVerified) {
      alert(texts.recaptchaError)
      return
    }

    const formData = new FormData(event.currentTarget)
    const token = recaptchaRef.current?.getValue()

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })

      if (!response.ok)
        throw new Error(`Form submission failed: ${response.status}`)

      const responseData = await response.json()
      console.log(responseData)
      alert(texts.formSuccess)
      recaptchaRef.current?.reset()
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
      className="font-cinzel w-full"
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
          className="font-arsenal border-2 rounded border-gray-400 p-1"
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
          className="font-arsenal border-2 rounded border-gray-400 p-1"
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
          className="font-arsenal border-2 rounded border-gray-400 p-1"
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
          className="font-arsenal border-2 rounded border-gray-400 p-1"
          rows={5}
        />
      </div>

      {/* Copyright Notice */}
      <p className=" font-arsenal pt-4">
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
            className=" mb-20 md:mt-4 text-gray-700 hover:text-black hover:scale-105 ease-in duration-600 border-2 border-gray-400 rounded-lg shadow-md p-2 "
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

