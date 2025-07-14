
Design a web application feature that allows users to interact with a PDF document.

**User Story:**
As a user, I want to be able to:
1.  **Select a PDF file** from my device.
2.  **View the PDF content** page by page.
3.  **Draw rectangular boxes** anywhere on any page of the PDF.
4.  **Tap on a drawn rectangle** to view its coordinates and the dimensions of the page it's on.

**Technical Requirements:**
* **Input:** The application must accept a PDF file as input.
* **PDF Rendering:** Efficiently display multi-page PDF documents.
* **Drawing Functionality:** Implement a mechanism for users to draw persistent rectangular annotations on any page of the PDF.  They can resize the rectangle boxes as well.
* **Coordinate Logging (on tap):**
    * When a drawn rectangle is tapped, the app should **log the coordinates of that rectangle**.
    * Coordinates must be **relative to the top-left corner of the specific page** on which the rectangle is drawn.
    * Coordinates should be presented in a standard unit (e.g., points).
    * Simultaneously, the app must **log the dimensions (width and height) of the page** where the tapped rectangle resides.
    * All logs should clearly indicate the **page number** to which the coordinates and page size correspond.

**Example Log Format (for a tapped rectangle on Page 2):**
Page Number: 2 Page Size: Width=612.0, Height=792.0 (points) Rectangle Coordinates: X=100.0, Y=250.0, Width=50.0, Height=75.0 (points)

**Considerations:**
* How will the drawing interaction work (e.g., drag to draw)?
* How will drawn rectangles be stored and retrieved when the PDF is re-opened? (Though not explicitly logged, consider the underlying data structure).
* Error handling for invalid PDF inputs.
