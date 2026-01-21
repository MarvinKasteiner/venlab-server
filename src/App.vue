<template>
  <div id="app" class="min-h-screen transition-colors duration-300 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">

    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Lab Data</h1>
          <p>Management System</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Username</label>
            <input
                type="text"
                v-model="username"
                placeholder="username"
                required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
                type="password"
                v-model="password"
                placeholder="password"
                required
            >
          </div>

          <p v-if="loginError" class="error-text">{{ loginError }}</p>

          <button type="submit" :disabled="loading" class="login-btn">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>

          <p class="hint-text">For demo use: <strong>admin</strong> / <strong>admin</strong></p>
        </form>
      </div>
    </div>

    <div v-else class="app-content">
      <nav>
        <div class="nav-brand">
          <h1>Lab Data Management</h1>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
        <div class="nav-links">
          <a @click="view='analysis'" :class="{active: view=='analysis'}">Analysis</a>
          <a @click="view='sample'" :class="{active: view=='sample'}">Sample</a>
          <a @click="view='box'" :class="{active: view=='box'}">Box</a>
          <a @click="view='boxpos'" :class="{active: view=='boxpos'}">BoxPos</a>
          <a @click="view='log'" :class="{active: view=='log'}">Log</a>
          <a @click="view='threshold'" :class="{active: view=='threshold'}">Threshold</a>
        </div>
        <button @click="toggleDark()" class="ml-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600">
          {{ isDark ? 'Lightmode' : 'Darkmode' }}
        </button>
      </nav>

      <main>
        <div class="data-controls bg-[#eaf0f6] dark:bg-slate-800 border-[#dbe2ef] dark:border-slate-700">
          <label class="dark:text-white">Data Limit (Records):</label>
          <input
              class="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              type="number"
              id="limit-input"
              v-model.number="limit"
              min="1"
              :disabled="noLimit"
              @change="loadData"
          >

          <label class="dark:text-white" for="nolimit-toggle">Disable Limit:</label>
          <input
              class="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              type="checkbox"
              id="nolimit-toggle"
              v-model="noLimit"
              @change="loadData"
          >

          <p class="warning-text">
            ⚠️ Disabling the limit may cause long loading times and high memory usage.
          </p>

          <div class="column-picker border-l border-slate-300 dark:border-slate-600 pl-4 ml-4">
            <label class="font-bold text-sm block mb-1 dark:text-slate-200">Visible Columns:</label>
            <div class="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
              <label v-for="col in columns[view]" :key="col" class="flex items-center gap-1 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 p-1 rounded">
                <input
                    type="checkbox"
                    :value="col"
                    v-model="selectedColumns"
                    class="w-3 h-3"
                >
                <span class="dark:text-slate-200">{{ col }}</span>
              </label>
            </div>
          </div>
        </div>

        <DataTable
            :title="view.toUpperCase()"
            :columns="selectedColumns"
            :data="data"
            :loading="loading"
            @add="addItem"
            @edit="editItem"
            @delete="deleteItem"
        />
      </main>

      <EditModal
          :show="showEditModal"
          :item="editingItem"
          :entity-type="view"
          :fields="columns[view]"
          :read-only-fields="readOnlyFields[view]"
          @close="closeEditModal"
          @save="saveItem"
          @add="saveItem"
      />
    </div>
  </div>
</template>

<script>
// --- SERVICE IMPORTS ---
// Hier importieren wir die neuen Service-Klassen anstatt api direkt zu nutzen (außer für Login)
import api from './services/api.js' // Nur noch für Login/Hash genutzt

// Um Fehler zu vermeiden, erstelle bitte auch Dummy-Services für Analysis/Threshold
// oder implementiere sie vollständig wie Sample/Box/Log.

import AnalysisService from './services/AnalysisService.js'
import SampleService from './services/SampleService.js'
import BoxService from './services/BoxService.js'
import BoxPosService from './services/BoxPosService.js'
import LogService from './services/LogService.js'
//import ThresholdService from './services/ThresholdService.js'

import DataTable from './components/DataTable.vue'
import EditModal from './components/EditModal.vue'

export default {
  components: { DataTable, EditModal },
  data() {
    return {
      // Login State
      isLoggedIn: false,
      username: '',
      password: '',
      loginError: '',
      isDark: false,

      // App State
      view: 'analysis',
      data: [],
      loading: false,
      showEditModal: false,
      editingItem: null,

      limit: 50,
      noLimit: false,

      selectedColumns: [],

      // Definition der Read-Only Felder
      readOnlyFields: {
        analysis: [
          's_id', 's_stamp', 'weight_bru', 'weight_net', 'name', 'box_name', 'date_exported',
        ],
        sample: [
          's_id', 's_stamp', 'box_position', 'weight_net', 'weight_bru', 'date_exported'
        ],
        box: ['b_id', 'date_exported'],
        boxpos: ['bpos_id', 'b_id', 's_id', 's_stamp', 'date_exported'],
        log: ['log_id', 'date_created', 'date_exported', 's_id', 's_stamp', 'a_id'],
        threshold: [
          'date_created', 'date_changed',
        ],
      },
      // Definition aller verfügbaren Spalten
      columns: {
        analysis: [
          'a_id', 's_id', 's_stamp', 'pol', 'nat', 'kal', 'an', 'glu', 'dry',
          'date_in', 'date_out', 'weight_mea', 'weight_nrm', 'weight_cur', 'weight_dif',
          'density', 'a_flags', 'lane', 'comment', 'date_exported', 'weight_bru', 'weight_net',
          'name', 'box_name'
        ],
        sample: [
          's_id', 's_stamp', 'name', 'weight_net', 'weight_bru', 'weight_tar',
          'quantity', 'distance', 'date_crumbled', 's_flags', 'lane', 'comment', 'date_exported',
          'box_position'
        ],
        box: [
          'b_id', 'name', 'num_max', 'type', 'comment', 'date_exported'
        ],
        boxpos: [
          'bpos_id', 'b_id', 's_id', 's_stamp', 'date_exported'
        ],
        log: ['log_id', 'date_created', 'level', 'info', 's_id', 's_stamp', 'a_id', 'date_exported'],
        threshold: [
          'th_id', 'th_type', 'th_min', 'th_max', 'th_comment',
          'date_created', 'date_changed'
        ]
      }
    }
  },

  computed: {
    // Mapping des aktuellen Views auf den entsprechenden Service
    currentService() {
      const serviceMap = {
        'analysis': AnalysisService,
        'sample': SampleService,
        'box': BoxService,
        'boxpos': BoxPosService,
        'log': LogService,
        'threshold': ThresholdService
      };

      return serviceMap[this.view];
    }
  },

  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
      document.documentElement.classList.add('dark');
    }
  },

  watch: {
    view: {
      immediate: true,
      handler(newView) {
        // Reset columns wenn View wechselt
        this.selectedColumns = [...this.columns[newView]];
        // Daten nur laden wenn eingeloggt
        if(this.isLoggedIn) {
          this.loadData();
        }
      }
    }
  },

  methods: {
    toggleDark() {
      this.isDark = !this.isDark;
      if (this.isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },

    async hashPassword(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async handleLogin() {
      this.loginError = ''
      this.loading = true

      const TARGET_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

      await new Promise(resolve => setTimeout(resolve, 800))

      const inputHash = await this.hashPassword(this.password);

      if (this.username === 'admin' && inputHash === TARGET_HASH) {
        this.isLoggedIn = true
        this.loadData()
      } else {
        this.loginError = 'Invalid credentials'
      }

      this.loading = false
    },

    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.password = ''
      this.data = []
    },

    // --- REFACTORED LOAD DATA ---
    async loadData() {
      this.loading = true
      try {
        const service = this.currentService;

        if (!service) {
          throw new Error(`Service for view '${this.view}' not found.`);
        }

        const params = {
          limit: this.noLimit ? 0 : this.limit,
        };

        // Aufruf der Service-Methode.
        // Der Service liefert bereits gemappte Model-Objekte zurück.
        this.data = await service.getAll(params);

        console.log(`Loaded ${this.data.length} records via ${this.view}Service`);

      } catch (err) {
        console.error('Error loading data:', err)
        alert(`Error loading ${this.view}: ${err.message}`)
        this.data = []
      } finally {
        this.loading = false
      }
    },

    addItem() {
      this.editingItem = null
      this.showEditModal = true
    },

    editItem(item) {
      // Kopie erstellen
      this.editingItem = Object.assign(Object.create(Object.getPrototypeOf(item)), item);
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editingItem = null
    },

    // --- REFACTORED SAVE ITEM ---
    async saveItem(payload) {
      const service = this.currentService;
      const isNewItem = !this.editingItem;
      const action = isNewItem ? 'Creation' : 'Update';

      try {
        if (isNewItem) {
          await service.create(payload);
        } else {
          await service.update(payload);
        }

        alert(`Record successfully ${isNewItem ? 'created' : 'updated'}`)
        this.closeEditModal()
        this.loadData()
      } catch (err) {
        console.error(`${action} failed:`, err)
        alert(`${action} failed: ${err.response?.data?.message || err.message}`)
      }
    },

    // --- REFACTORED DELETE ITEM ---
    async deleteItem(item) {
      if (confirm(`Delete this ${this.view} record? This action cannot be undone.`)) {
        try {
          const service = this.currentService;

          await service.delete(item);

          alert('Successfully deleted')
          this.loadData()
        } catch (err) {
          console.error('Delete failed:', err)
          alert(`Delete failed: ${err.response?.data?.message || err.message}`)
        }
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

/* --- LOGIN SCREEN STYLES --- */
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #112d4e 0%, #3f72af 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 380px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #112d4e;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 5px;
}

.login-header p {
  color: #888;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #eef2f7;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: #3f72af;
  outline: none;
  background: #f8fbff;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #112d4e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.login-btn:hover {
  background: #3f72af;
}

.login-btn:disabled {
  background: #9aaec7;
  cursor: not-allowed;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  background: #fff5f5;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ffebeb;
}

.hint-text {
  text-align: center;
  margin-top: 20px;
  color: #aaa;
  font-size: 12px;
}

.logout-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 15px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
}

/* --- MAIN APP STYLES (Existing) --- */
nav {
  background: #112d4e;
  color: white;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-brand h1 {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #dbe2ef;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  color: #dbe2ef;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 15px;
  user-select: none;
  border: 1px solid transparent;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(0);
}

.nav-links a.active {
  background: #3f72af;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #3f72af;
}

main {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 40px;
}

/* --- Data Control Styles --- */
.data-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #eaf0f6;
  border-radius: 6px;
  border: 1px solid #dbe2ef;
}

.data-controls label {
  font-weight: 600;
  color: #112d4e;
  font-size: 14px;
}

.data-controls input[type="number"] {
  width: 80px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.data-controls input[type="number"]:focus {
  border-color: #3f72af;
  outline: none;
}

.data-controls input[type="number"]:disabled {
  background-color: #f0f0f0;
}

.warning-text {
  color: #f44336;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  padding: 0 10px;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 16px;
    padding: 16px 16px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  main {
    max-width: 100%;
    padding: 0 16px;
    margin: 24px auto;
  }

  .data-controls {
    flex-wrap: wrap;
    gap: 10px;
  }
}
/* Dark Mode Global Styles */
html.dark {
  background: #0f172a;
}

html.dark body {
  background: #0f172a;
  color: #e2e8f0;
}

html.dark nav {
  background: #1e293b;
}

html.dark .data-controls {
  background: #1e293b;
  border-color: #334155;
}

html.dark .data-controls label {
  color: #e2e8f0;
}
</style>