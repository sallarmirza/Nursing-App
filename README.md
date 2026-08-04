# Digital Nursing Assistant (Mobile Application)



> **Figma Design Link:** (https://www.figma.com/design/851msbetSdJE6Jon8SAUq9/Digital-Nursing-Assistant?node-id=0-1&t=9m5oyI98wORNhAF9-1)

---

## 1. Introduction



### 1.1 Purpose



This document outlines the complete functional and non-functional requirements for the Digital Nursing Assistant mobile application, which is engineered to minimize clinical paperwork, streamline bedside calculations, organize patient history, and standardize shift transitions.

### 1.2 Scope



The application acts as a comprehensive clinical companion tool for nurses and student nurses, providing secure access to medication safety calculators, IV drip rate computations, digital patient health records, daily clinical observation notes, and structured SBAR shift handovers.

---

## 2. Overall Description



### 2.1 Product Perspective



* A cross-platform mobile application featuring a card-based user interface optimized for high-paced clinical environments.


* Emphasizes high legibility, fast-tap interactions, and low-light night modes.



### 2.2 User Classes



* **Registered Nurses / Student Nurses:** Primary operators responsible for logging vitals, calculating drug dosages, performing daily assessments, managing records, and executing handovers.



### 2.3 Operating Environment



* Mobile operating systems (iOS and Android) with secure local database storage and offline-first capabilities.



---

## 3. System Features & Functional Requirements



### 3.1 Active Modules (Core System)



* **3.1.1 Dosage Calculator**

* **Description:** Computes safe medication dosages and triggers automated safety threshold warnings.


* **Inputs:** Desired dose, stock concentration/strength, and vehicle volume.


* **Outputs:** Calculated administration volume with automated boundary checks to flag incorrect dosages.




* **3.1.2 IV Drip Rate Calculator**

* **Description:** Calculates precise fluid delivery rates in drops per minute.


* **Inputs:** Total infusion volume, total time duration, and administration set drop factor (e.g., 15 gtt/mL or 20 gtt/mL).


* **Outputs:** Computed flow rate expressed in drops per minute (drops/min).




* **3.1.3 Patient Records**

* **Description:** A centralized directory to view, search, and edit patient clinical profiles, admission backgrounds, and bed details.


* **Integrated Feature:** Houses the embedded SBAR handover log directly within each patient record profile.





### 3.2 Advanced & Upcoming Modules ("Coming Soon" Phase)



* **3.2.1 Nursing Notes (Daily Digital Observations)**

* **Description:** Replaces traditional paper charting with systematic digital observation entries.


* **Functionality:** Structured system checklists capturing neurological status (e.g., GCS metrics), respiratory patterns, cardiovascular parameters, and integumentary/skin risk assessments.




* **3.2.2 SBAR Shift Handover Module (Integrated in Patient Records)**

* **Description:** A standardized electronic communication framework ensuring safe transfer of clinical responsibility between shifts.


* **Detailed Sub-Sections:**
* **Situation (S):** Immediate concise statement of the patient's current acute status or primary reason for handover focus, complete with an automated timestamp.


* **Background (B):** Historical clinical context, admitting diagnosis, code status, and treatments administered during the outgoing shift.


* **Assessment (A):** Professional evaluation of current physiological parameters, vital signs, and active clinical concerns.


* **Recommendation (R):** Action-item checklist detailing upcoming medications, scheduled diagnostics, and physician orders required for the incoming shift team.







---

## 4. Non-Functional Requirements



### 4.1 Usability & Interface Design



* Clean card-based layout structure prioritizing thumb-friendly navigation and high-contrast typography for low-light night shifts.



### 4.2 Performance & Reliability



* Instantaneous state transitions and real-time calculator response times to prevent delays in critical clinical situations.



### 4.3 Data Security & Privacy



* Strict adherence to data protection standards ensuring secure local and cloud synchronization for sensitive patient medical histories.
