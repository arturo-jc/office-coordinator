'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label, TextInput, Textarea, Button, Datepicker } from 'flowbite-react'
import { Plus, X } from 'lucide-react'

interface Attendee {
  id: string
  name: string
  contact: string
}

export default function NewInviteForm() {
  const router = useRouter()
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState('')
  const [place, setPlace] = useState('')
  const [description, setDescription] = useState('')
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [newAttendeeName, setNewAttendeeName] = useState('')
  const [newAttendeeContact, setNewAttendeeContact] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAddAttendee = () => {
    if (newAttendeeName.trim() && newAttendeeContact.trim()) {
      setAttendees([
        ...attendees,
        {
          id: Date.now().toString(),
          name: newAttendeeName,
          contact: newAttendeeContact,
        },
      ])
      setNewAttendeeName('')
      setNewAttendeeContact('')
    }
  }

  const handleRemoveAttendee = (id: string) => {
    setAttendees(attendees.filter((attendee) => attendee.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate we have attendees with emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const contacts = attendees
        .filter(attendee => emailRegex.test(attendee.contact))
        .map(attendee => ({
          email: attendee.contact,
          name: attendee.name,
        }))

      if (contacts.length === 0) {
        setError('Please add at least one attendee with a valid email address')
        setIsSubmitting(false)
        return
      }

      // Combine date and time into ISO datetime string
      if (!eventDate || !startTime) {
        setError('Please provide both date and time')
        setIsSubmitting(false)
        return
      }

      const [hours, minutes] = startTime.split(':')
      const dateTime = new Date(eventDate)
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const response = await fetch('/api/send-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts,
          meetingTitle: eventTitle,
          meetingDateTime: dateTime.toISOString(),
          location: place || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send invites')
      }

      // Navigate to invites page on success
      router.push('/invites')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm">
      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <Label htmlFor="eventTitle">Event Title</Label>
          <TextInput
            id="eventTitle"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Preferred Window */}
        <div>
          <Label>Preferred Window</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <Label htmlFor="eventDate" className="mb-2">Date</Label>
              <Datepicker
                id="eventDate"
                value={eventDate}
                onChange={(date) => setEventDate(date)}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime" className="mb-2">Start Time</Label>
              <TextInput
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration" className="mb-2">Duration (minutes)</Label>
              <TextInput
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min={1}
                required
              />
            </div>
          </div>
        </div>

        {/* Place */}
        <div>
          <Label htmlFor="place">Place</Label>
          <TextInput
            id="place"
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>

        {/* Event Description */}
        <div>
          <Label htmlFor="description">Event Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the event"
            rows={5}
            required
          />
        </div>

        {/* Attendees */}
        <div>
          <Label>Attendees</Label>

          {/* Existing Attendees */}
          {attendees.length > 0 && (
            <div className="mb-4 space-y-2 mt-2">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {attendee.name}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {attendee.contact}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttendee(attendee.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Attendee */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <TextInput
              type="text"
              value={newAttendeeName}
              onChange={(e) => setNewAttendeeName(e.target.value)}
              placeholder="Name"
              className="flex-1"
            />
            <TextInput
              type="text"
              value={newAttendeeContact}
              onChange={(e) => setNewAttendeeContact(e.target.value)}
              placeholder="Phone or Email"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddAttendee}
              color="blue"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            color="gray"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="blue"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Invites...' : 'Create Invite'}
          </Button>
        </div>
      </div>
    </form>
  )
}
