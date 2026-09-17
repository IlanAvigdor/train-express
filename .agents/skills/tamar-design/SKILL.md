---
name: Tamar Design System
description: Guidelines and principles for maintaining the premium "Tamar" design aesthetic (Gold/Champagne, elegant typography) across the application.
---

# Tamar Design System Guidelines

This skill enforces the specific design principles established for Tamar's applications, particularly the premium digital contract interface. Whenever you are asked to create new UI components, pages, or forms for Tamar, you MUST adhere strictly to these guidelines.

## 1. Color Palette

*   **Primary (Text/Accents):** `#1c1c1c` - Deep, elegant dark grey.
*   **Secondary (Brand/Highlights):** `#c9a76d` - Gold/Champagne. Use for primary action highlights, important icons, and progress bars.
*   **Background (App):** `#faf9f6` - Off-white/Cream. Provides a softer, more premium feel than pure white.
*   **Background (Cards):** `#ffffff` - Pure white for overlapping cards to create depth.
*   **Text (Main):** `#222222`
*   **Text (Muted):** `#666666`
*   **Surface/Inputs (Light):** `#f8fafc` - Used for input backgrounds and secondary panels.
*   **Error:** `#e03131`

## 2. Typography

*   **Headings (h1, h2, h3, h4):** `Playfair Display`, serif.
    *   Style: `var(--color-primary)` color, `600` font-weight, `1.2` line-height.
*   **Body:** `Heebo`, sans-serif.
    *   Style: `var(--color-text-main)` color, `1.6` line-height.

## 3. UI Components

### Cards (`.wizard-card`)
*   Background: `#ffffff`
*   Border Radius: `20px` (`var(--radius-lg)`)
*   Shadow: Large soft shadow (`0 20px 25px -5px rgba(0,0,0,0.1)`)
*   Border: Subtle `1px solid rgba(0,0,0,0.03)`

### Buttons (`.btn`)
*   Shape: Pill-shaped / fully rounded (`border-radius: 9999px`).
*   Layout: `inline-flex`, `align-items: center`, `justify-content: center`, `gap: 0.5rem`.
*   **Primary (`.btn-primary`):** Background `#1c1c1c`, text `#ffffff`.
    *   *Note:* Sometimes overridden with Secondary color (`#c9a76d`) for ultimate call-to-action (like "Submit").
*   **Secondary (`.btn-secondary`):** Background `#f1f5f9`, text `#222222`.
*   **Outline (`.btn-outline`):** Transparent, border `#1c1c1c`, text `#1c1c1c`.

### Forms
*   **Inputs:** Background `#f8fafc`, border `1px solid #e2e8f0`, radius `12px`.
*   **Focus State:** Border changes to Secondary color (`#c9a76d`), with a soft gold focus ring (`box-shadow: 0 0 0 3px rgba(201, 167, 109, 0.15)`).
*   **Labels:** Font weight `500`, primary color.

### Icons
*   Use `lucide-react`.
*   For section headers, use an icon colored in the Secondary color (`#c9a76d`), size `28`, placed next to the heading.

## 4. Layout & Animations

*   **RTL Orientation:** The app is in Hebrew. Ensure icons (like arrows) point in the correct direction for RTL (e.g., `ArrowRight` means "Back").
*   **Animations:** Use the `.animate-fade-in` class for new views/steps entering the screen (fades in and translates up slightly).
*   **Spacing:** Use generous padding (`1.5rem` to `2.5rem`) to let elements breathe. Group related elements with flexbox and consistent gaps.
