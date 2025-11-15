'use client'

import { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TextField } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { Plus, X } from 'lucide-react'

interface Attendee {
  id: string
  name: string
  contact: string
}

export default function NewInviteForm() {
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState<Dayjs | null>(null)
  const [startTime, setStartTime] = useState<Dayjs | null>(null)
  const [duration, setDuration] = useState('')
  const [place, setPlace] = useState('')
  const [description, setDescription] = useState('')
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [newAttendeeName, setNewAttendeeName] = useState('')
  const [newAttendeeContact, setNewAttendeeContact] = useState('')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log({
      eventTitle,
      eventDate,
      startTime,
      duration,
      place,
      description,
      attendees,
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm">
        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Preferred Window */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Preferred Window
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DatePicker
                label="Date"
                value={eventDate}
                onChange={(newValue) => setEventDate(newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
              <TextField
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </div>
          </div>

          {/* Place */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Place
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              required
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Describe the event"
              required
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Attendees
            </label>

            {/* Existing Attendees */}
            {attendees.length > 0 && (
              <div className="mb-4 space-y-2">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
              <input
                type="text"
                value={newAttendeeContact}
                onChange={(e) => setNewAttendeeContact(e.target.value)}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone or Email"
              />
              <button
                type="button"
                onClick={handleAddAttendee}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Invite
            </button>
          </div>
        </div>
      </form>
    </LocalizationProvider>
  )
}
