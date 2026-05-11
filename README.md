# Recipe Sharing App

A modern full-stack recipe sharing platform built with Next.js, TypeScript, Supabase, MongoDB, Clerk authentication, and Tailwind CSS.

## Why I built this?
I noticed many food creators on Instagram share recipes through captions or screenshots because maintaining a personal website can be time-consuming and expensive. I built this platform to give creators a simple way to publish, organize, and share recipes in a more structured and user-friendly format.

Users can:

* Browse and search recipes
* Upload recipe images
* Create and manage recipes
* Save and download recipes as PDFs
* View recipes by category or cuisine
* Create user profiles
* Upload a recipe PDF to autofill the form
* Authenticate securely with Clerk
* Add reviews
* Search for recipes or an author in the global search bar

## Tech Stack

### Frontend

* Next.js 14 (App Router) + TypeScript
* Tailwind CSS
* Radix UI
* React Toastify

### Backend / Services

* MongoDB + Mongoose
* Supabase Storage for storing recipe images after getting a signed URL from Supabase
* Clerk Authentication

### Other Libraries

* @react-pdf/renderer
* browser-image-compression 


## Features

### Recipe Management

* Create recipes
* Edit recipes
* Delete recipes
* Upload recipe images
* Categorize recipes

### Performance Optimizations

* Client-side image compression before upload
* Server Components where possible
* Dynamic imports for heavy libraries

### Image Upload Flow

1. User selects an image
2. Image is compressed client-side
3. App requests a signed upload URL from Supabase
4. Client uploads directly to Supabase Storage
5. Public image URL is stored in the database

## Future Improvements

* Recipe recommendations
* Upgrade to the latest Next.js version (16)

