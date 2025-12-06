<template>
  <div class="main-content">
    <AdminNavigationBar />
    <div class="records-container">
      <h1>Records Management</h1>
      <div class="actions">
        <label class="custom-file-upload">
          <input type="file" @change="importExcel" accept=".xlsx, .xls" />
          <span>Import Excel</span>
        </label>
        <button class="action-button open" style="margin-bottom:0;" @click="openFirebaseFileModal">Open File</button>
        <!-- Modal for selecting file from Firebase Storage -->
        <div v-if="showFirebaseFileModal" class="modal-overlay">
          <div class="modal-content">
            <h2>Select a file from Firebase Storage</h2>
            <div v-if="firebaseFileList.length === 0" style="margin-bottom: 1em;">Loading files...</div>
            <ul v-else class="file-list">
              <li v-for="file in firebaseFileList" :key="file.name" class="file-list-item">
                <button @click="loadSelectedFirebaseFile(file)" class="file-select-btn">{{ file.name }}</button>
              </li>
            </ul>
            <button class="modal-close-btn" @click="showFirebaseFileModal = false">Cancel</button>
          </div>
        </div>
        <button class="action-button export" @click="exportExcel">Export Excel</button>
        <button class="action-button add" @click="addNewRow">Add New Row</button>
        <button class="action-button save" @click="saveToFirestore">Save</button>
      </div>
      <div class="summary-bar">
        <div class="summary-item">
          <span class="summary-label">Total Records</span>
          <span class="summary-value">{{ data.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Delays Detected</span>
          <span class="summary-value">{{ delays.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Overdue Steps</span>
          <span class="summary-value">{{ overdueCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">On Time</span>
          <span class="summary-value">{{ onTimeCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Avg. Process Time</span>
          <span class="summary-value">{{ avgProcessTime }} days</span>
        </div>
      </div>
      <div class="table-responsive zoom-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: `${100 / zoomLevel}%` }">
        <table>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">{{ header }}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in data" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                <div style="display: flex; flex-direction: column; align-items: stretch;">
                  <input v-model="data[rowIndex][cellIndex]" @input="onCellInput(rowIndex, cellIndex)" />
                  <!-- Status indicator below cell -->
                  <div v-if="headers.length > 1 && cellIndex < headers.length" style="margin-top: 2px;">
                    <span class="text-xs italic text-slate-500" style="display: block;">
                      {{ getCellStatus(cell, row[cellIndex + 1], rowIndex, cellIndex)?.text }}
                    </span>
                    <div class="w-full h-1 mt-1 bg-slate-200 rounded">
                      <div
                        class="h-1 rounded bg-emerald-500 transition-all duration-300"
                        :style="{ width: (getCellStatus(cell, row[cellIndex + 1], rowIndex, cellIndex).progress * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
  <span v-if="row._overdueSteps && row._overdueSteps.length" class="overdue">
    Overdue: {{ row._overdueSteps.join('; ') }}
  </span>
  <span v-else class="on-time">On Time</span>
  <!-- Status bar removed; only STATUS field is used for process step -->
</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="zoom-bar">
        <label for="zoom-slider">Zoom:</label>
        <span>{{ Math.round(zoomLevel * 100) }}%</span>
      </div>
      <p v-if="delays.length">Delays Detected: {{ delays.length }}</p>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { listAll, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(duration);
dayjs.extend(customParseFormat);
import AdminNavigationBar from "./AdminNavigationBar.vue";
// import ProcurementStatusBar from "./ProcurementStatusBar.vue";

export default {
  name: "RecordsManagement",
  components: {
    AdminNavigationBar,
    // ProcurementStatusBar removed
  },
  data() {
    return {
      headers: [],
      data: [],
      delays: [],
      zoomLevel: 1,
      steps: [], // not used for dynamic, but kept for compatibility
      cellTimestamps: [], // NEW: stores edit timestamps for each cell
      showFirebaseFileModal: false,
      firebaseFileList: [],
    };
  },
  computed: {
    onTimeCount() {
      if (!this.headers.length) return 0;
      return this.data.filter(row => !row._overdueSteps || row._overdueSteps.length === 0).length;
    },
    avgProcessTime() {
      if (!this.headers.length) return 0;
      const dateIndex = this.headers.findIndex(h => {
        const header = (h || '').toLowerCase();
        return header.includes('date') || header.includes('deadline') || header.includes('due');
      });
      if (dateIndex === -1 || !this.data.length) return 0;
      const today = dayjs();
      const daysArr = this.data.map(row => {
        const date = dayjs(row[dateIndex]);
        return date.isValid() ? today.diff(date, 'day') : null;
      }).filter(days => days !== null && days >= 0);
      if (!daysArr.length) return 0;
      const avg = daysArr.reduce((a, b) => a + b, 0) / daysArr.length;
      return Math.round(avg);
    },
    overdueCount() {
      return this.data.filter(row => row._overdueSteps && row._overdueSteps.length).length;
    },
  },
  methods: {
    async openFirebaseFileModal() {
      this.showFirebaseFileModal = true;
      this.firebaseFileList = [];
      try {
        const listRef = ref(storage, 'excel-files');
        const res = await listAll(listRef);
        this.firebaseFileList = res.items.map(item => ({
          name: item.name,
          fullPath: item.fullPath
        }));
      } catch (e) {
        console.error('Error fetching file list:', e);
        alert('Failed to fetch file list from Firebase Storage.');
        this.showFirebaseFileModal = false;
      }
    },
    async loadSelectedFirebaseFile(file) {
      try {
        const fileRef = ref(storage, file.fullPath);
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object' && !Array.isArray(json[0])) {
          this.headers = Object.keys(json[0]);
          this.data = json.map(row => this.headers.map(h => row[h]));
        } else if (Array.isArray(json)) {
          this.data = json;
          this.headers = json[0]?.map((_, i) => `Column ${i + 1}`) || [];
        } else if (json.headers && json.data) {
          this.headers = json.headers;
          this.data = json.data;
        } else {
          console.warn('Unrecognized format', json);
          alert('Unrecognized file format.');
          return;
        }
        this.ensureDataConsistency();
        this.detectDelays();
        this.detectOverdueSteps();
        this.showFirebaseFileModal = false;
      } catch (e) {
        console.error('Error loading file:', e);
        alert('Failed to load file from Firebase Storage.');
      }
    },
    importExcel(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        this.headers = jsonData[0];
        this.data = jsonData.slice(1).map((row) => {
          return row.map((cell, index) => {
            if (this.isDateColumn(index)) {
              if (typeof cell === "number") {
                return dayjs("1899-12-30").add(cell, "day").format("YYYY-MM-DD");
              } else if (typeof cell === "string") {
                const parsed = dayjs(cell, ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "YYYY/MM/DD", "MMM-DD", "MMMM D, YYYY"], true);
                if (parsed.isValid()) {
                  return parsed.format("YYYY-MM-DD");
                }
              }
            } 
            return cell;
          });
        });
        this.ensureDataConsistency();
        this.detectDelays();
        this.detectOverdueSteps();
      };
      reader.readAsBinaryString(file);
    },

    // generateStatusHistory removed; now only STATUS field is used for process step
    isDateColumn(index) {
      const dateKeywords = ["date", "deadline", "due"];
      return dateKeywords.some((keyword) =>
        this.headers[index]?.toLowerCase().includes(keyword)
      );
    },
    exportExcel() {
      const worksheet = XLSX.utils.aoa_to_sheet([this.headers, ...this.data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "exported_data.xlsx");
    },
    // --- DYNAMIC STATUS INDICATOR LOGIC ---
    parseDate(value) {
      if (!value || typeof value !== 'string' || value.includes('#')) return null;
      const parsed = dayjs(value.trim(), [
        'YYYY-MM-DD', 'YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'MMM-DD', 'MMM D', 'MMMM D, YYYY', 'MMM D, YYYY'
      ], true);
      return parsed.isValid() ? parsed : null;
    },
    onCellInput(rowIndex, cellIndex) {
      // Called on input event for a cell
      if (!this.cellTimestamps) this.cellTimestamps = [];
      if (!this.cellTimestamps[rowIndex]) this.cellTimestamps[rowIndex] = [];
      this.cellTimestamps[rowIndex][cellIndex] = Date.now();
    },
    getNextNonEmptyDate(row, startIdx) {
      for (let i = startIdx + 1; i < row.length; i++) {
        const d = this.parseDate(row[i]);
        if (d) return row[i];
      }
      return null;
    },
    getCellStatus(currentValue, nextValue, rowIndex, cellIndex) {
      // Use next non-empty cell for status
      const row = this.data[rowIndex];
      const nextNonEmpty = this.getNextNonEmptyDate(row, cellIndex);
      const from = this.parseDate(currentValue);
      const to = this.parseDate(nextNonEmpty) || dayjs();
      if (!from) return { text: '—', color: 'gray', progress: 0 };
      let diff, dur, human, isDone, isDelayed, progress, color;
      if (!nextNonEmpty) {
        // Next step is empty, so use edit timestamp if available
        let ts = this.cellTimestamps?.[rowIndex]?.[cellIndex];
        if (ts) {
          diff = Date.now() - ts;
          dur = dayjs.duration(diff);
          human = `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m`;
          isDone = false;
          isDelayed = diff > 86400000; // 1 day
          progress = Math.min(diff / 86400000, 1);
          if (!isDelayed) color = 'blue';
          else color = 'red';
        } else {
          diff = dayjs().diff(from);
          dur = dayjs.duration(diff);
          human = `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m`;
          isDone = false;
          isDelayed = diff > 86400000; // 1 day
          progress = Math.min(diff / 86400000, 1);
          if (!isDelayed) color = 'blue';
          else color = 'red';
        }
      } else {
        diff = to.diff(from);
        dur = dayjs.duration(diff);
        human = `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m`;
        isDone = !!nextNonEmpty && this.parseDate(nextNonEmpty)?.isValid();
        isDelayed = diff > 86400000; // 1 day
        progress = Math.min(diff / 86400000, 1);
        if (isDone && !isDelayed) color = 'green';
        else if (isDone && isDelayed) color = 'yellow';
        else if (!isDone && isDelayed) color = 'red';
        else color = 'blue';
      }
      const colorEmoji = {
        green: '🟢',
        yellow: '🟡',
        red: '🔴',
        blue: '🔵',
        gray: '⚪'
      }[color] || '';
      const text = (!nextNonEmpty)
        ? `⏳ In progress for ${human} ${colorEmoji}`
        : (isDone ? `✅ Done in ${human} ${colorEmoji}` : `⏳ In progress for ${human} ${colorEmoji}`);
      return { text, color, progress };
    },
    // --- END DYNAMIC STATUS INDICATOR LOGIC ---
    getStepStatus(fromDate, toDate) {
      const from = this.parseDate(fromDate);
      const to = this.parseDate(toDate) || dayjs();
      if (!from) return { text: '—', color: 'gray', progress: 0 };
      const diff = to.diff(from);
      const dur = dayjs.duration(diff);
      const human = `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m`;
      const isDone = !!toDate;
      const isDelayed = diff > 86400000; // 1 day
      const progress = Math.min(diff / 86400000, 1);
      let color = '';
      if (isDone && !isDelayed) color = 'green';
      else if (isDone && isDelayed) color = 'yellow';
      else if (!isDone && isDelayed) color = 'red';
      else color = 'blue';
      const text = isDone ? `✅ Done in ${human}` : `⏳ In progress for ${human}`;
      return { text, color, progress };
    },
    detectDelays() {
      const today = dayjs();
      const currentYear = today.year();
      const dateIndex = this.headers.findIndex(h =>
        (h || "").toLowerCase().includes("as of")
      );
      if (dateIndex === -1) {
        this.delays = [];
        return;
      }
      this.delays = this.data.filter(row => {
        let raw = (row[dateIndex] || "").toString().trim();
        if (/^[A-Za-z]{3,}[.\-\s]?\d{1,2}$/.test(raw)) {
          raw = raw.replace(/[.\-\s]+/g, " ");
          raw = `${raw}, ${currentYear}`;
        }
        let date = dayjs(raw, ["MMM D, YYYY", "MMM D YYYY", "YYYY-MM-DD"], true);
        if (!date.isValid()) {
          date = dayjs(raw);
        }
        return date.isValid() && today.diff(date, "day") > 10;
      });
      if (this.delays.length > 0) {
        alert(`⚠ ${this.delays.length} record(s) are delayed (over 10 days from 'AS OF' date).`);
      } else {
        alert("✅ No delays detected.");
      }
    },
    async saveToFirestore() {
      const file = new Blob([JSON.stringify({ headers: this.headers, data: this.data })], {
        type: "application/json",
      });
      const storageRef = ref(storage, `excel-files/records_${Date.now()}.json`);
      try {
        await uploadBytes(storageRef, file);
        alert("File saved to Firestore successfully!");
      } catch (error) {
        console.error("Error saving file to Firestore:", error);
      }
    },
    addNewRow() {
      // If headers are less than 40, expand them
      if (this.headers.length < 40) {
        for (let i = this.headers.length; i < 40; i++) {
          this.headers.push(`Column ${i + 1}`);
        }
        // Also update all existing rows to have 40 columns
        this.data = this.data.map(row => {
          const newRow = Array(40).fill("");
          row.forEach((cell, idx) => {
            if (idx < 40) newRow[idx] = cell;
          });
          return newRow;
        });
      }
      // Add a new row with 40 columns
      const newRow = Array(40).fill("");
      this.data.push(newRow);
      // Add a new timestamp row
      if (!this.cellTimestamps) this.cellTimestamps = [];
      this.cellTimestamps.push(Array(40).fill(null));
    },
    ensureDataConsistency() {
      this.data = this.data.map((row) => {
        const adjustedRow = Array(this.headers.length).fill("");
        row.forEach((cell, index) => {
          if (index < this.headers.length) {
            adjustedRow[index] = cell;
          }
        });
        return adjustedRow;
      });
      const maxRows = this.data.length;
      while (this.data.length < maxRows) {
        this.data.push(Array(this.headers.length).fill(""));
      }
      // Also ensure cellTimestamps matches data shape
      if (!this.cellTimestamps || this.cellTimestamps.length !== this.data.length) {
        this.cellTimestamps = this.data.map(() => Array(this.headers.length).fill(null));
      } else {
        this.cellTimestamps = this.data.map((row, rowIdx) => {
          const tsRow = this.cellTimestamps[rowIdx] || [];
          const newTsRow = Array(this.headers.length).fill(null);
          tsRow.forEach((ts, idx) => {
            if (idx < this.headers.length) newTsRow[idx] = ts;
          });
          return newTsRow;
        });
      }
    },
    detectOverdueSteps() {
      // Dynamic overdue detection: compare each cell to the next non-empty, left-to-right
      this.data.forEach((record) => {
        record._overdueSteps = [];
        for (let i = 0; i < this.headers.length - 1; i++) {
          const currDate = this.parseDate(record[i])?.startOf('day');
          if (currDate) {
            // Find next non-empty date cell
            let nextIdx = i + 1;
            let nextDate = null;
            while (nextIdx < this.headers.length) {
              nextDate = this.parseDate(record[nextIdx]);
              if (nextDate) {
                nextDate = nextDate.startOf('day');
                break;
              }
              nextIdx++;
            }
            if (!nextDate) {
              // If no next step and more than 1 day has passed since currDate, mark as overdue
              const diff = dayjs().startOf('day').diff(currDate, 'day');
              if (diff > 1) {
                record._overdueSteps.push(`No next step after ${this.headers[i]}`);
              }
            } else {
              // If next step is late by more than 1 day
              const diff = nextDate.diff(currDate, 'day');
              if (diff > 1) {
                record._overdueSteps.push(`${this.headers[nextIdx]} late by ${diff - 1} days`);
              }
            }
          }
        }
      });
    },
    handleZoomKeys(e) {
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
      } else if (e.ctrlKey && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.2);
      }
    },
    onSelectJsonFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object' && !Array.isArray(json[0])) {
            this.headers = Object.keys(json[0]);
            this.data = json.map(row => this.headers.map(h => row[h]));
          } else if (Array.isArray(json)) {
            this.data = json;
            this.headers = json[0]?.map((_, i) => `Column ${i + 1}`) || [];
          } else if (json.headers && json.data) {
            this.headers = json.headers;
            this.data = json.data;
          } else {
            console.warn('Unrecognized format', json);
            alert('Unrecognized file format.');
            return;
          }
          this.ensureDataConsistency();
          this.detectDelays();
          this.detectOverdueSteps();
        } catch (e) {
          console.error('Error reading file:', e);
          alert('Failed to load records from file.');
        }
      };
      reader.readAsText(file);
    },
  },
  mounted() {
    this.ensureDataConsistency();
    window.addEventListener('keydown', this.handleZoomKeys);
    const sidebarVisible = localStorage.getItem("sidebarVisible") === "true";
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.classList.toggle("collapsed", !sidebarVisible);
    }
    // No auto-fetch on mount
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleZoomKeys);
  },
  watch: {
    data: {
      handler() {
        this.detectDelays();
        this.detectOverdueSteps();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2em 2em 1.5em 2em;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}
.file-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1em 0;
  max-height: 200px;
  overflow-y: auto;
}
.file-list-item {
  margin-bottom: 0.5em;
}
.file-select-btn {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.2s ease;
}
.file-select-btn:hover {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  transform: translateY(-1px);
}
.modal-close-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  cursor: pointer;
  font-size: 1em;
  margin-top: 1em;
  font-weight: 500;
  transition: all 0.2s ease;
}
.modal-close-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
</style>

<style scoped>
.records-container {
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  color: #1e293b;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  min-height: 100vh;
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 1rem;
  text-align: center;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.actions {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

input[type="file"] {
  display: none;
}

.custom-file-upload {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
  text-align: center;
}

.custom-file-upload:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

.custom-file-upload:active {
  transform: translateY(0px);
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  color: #ffffff;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0px);
}

.export {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.open {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 2px 4px rgba(30, 41, 59, 0.2);
}
.open:hover {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  box-shadow: 0 4px 8px rgba(30, 41, 59, 0.3);
}

.export:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.detect {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
}

.detect:hover {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
  box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
}

.add {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

.add:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
}

.save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.save:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

th, td {
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
}

th {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.025em;
}

.overdue {
  color: #dc2626;
  font-weight: 600;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 6px;
  padding: 4px 8px;
  border: 1px solid #fecaca;
}
.on-time {
  color: #16a34a;
  font-weight: 600;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 6px;
  padding: 4px 8px;
  border: 1px solid #bbf7d0;
}

.summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.summary-item {
  color: #1e293b;
  padding: 12px 20px;
  border-radius: 8px;
  min-width: 120px;
  text-align: center;
  position: relative;
  font-size: 15px;
  font-weight: 500;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-label {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.zoom-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  margin-left: 0;
  justify-content: center;
  font-size: 16px;
  color: #1e293b;
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.zoom-bar label, .zoom-bar span {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

#zoom-slider {
  accent-color: #3b82f6;
  width: 200px;
  height: 6px;
  margin: 0 10px;
}

.zoom-container {
  transition: transform 0.2s;
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.collapsed {
  margin-left: 0;
}

@media screen and (max-width: 768px) {
  .summary-bar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  .summary-item {
    min-width: unset;
    border-radius: 4px 4px 0 0;
  }
}

@media screen and (max-width: 992px) {
  .actions {
    justify-content: center;
  }
  .custom-file-upload,
  .action-button {
    flex: 1 1 auto;
    min-width: 120px;
    max-width: 200px;
  }
}

@media screen and (max-width: 768px) {
  .records-container {
    padding: 15px;
  }
  .custom-file-upload,
  .action-button {
    flex: 1 1 40%;
  }
}

@media screen and (max-width: 480px) {
  .records-container {
    padding: 10px;
  }
  .custom-file-upload,
  .action-button {
    flex: 1 1 100%;
  }
}
</style>