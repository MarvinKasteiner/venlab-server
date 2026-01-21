<template>
  <div class="table-container">
    <div class="header">
      <h2>{{ title }}</h2>
      <button @click="$emit('add')" class="btn-add">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Add New
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>

    <div v-else-if="data.length === 0" class="no-data">
      <p>No data available for this view.</p>
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ formatHeader(col) }}</th>
          <th class="actions-header">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col" :class="getCellClass(row[col])">
            {{ formatValue(row[col]) }}
          </td>
          <td class="actions-cell">
            <button @click="$emit('edit', row)" class="btn-edit">Edit</button>
            <button @click="$emit('delete', row)" class="btn-delete">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    title: String,
    columns: Array,
    data: Array,
    loading: Boolean
  },
  methods: {
    formatHeader(col) {
      const headerMap = {
        'a_id': 'ID',
        's_id': 'Sample ID',
        's_stamp': 'Timestamp',
        'pol': 'POL',
        'nat': 'NAT',
        'kal': 'KAL',
        'an': 'AN',
        'glu': 'GLU',
        'dry': 'DRY',
        'date_in': 'Date In',
        'date_out': 'Date Out',
        'weight_mea': 'Weight Mea.',
        'weight_nrm': 'Weight Nrm.',
        'weight_cur': 'Weight Cur.',
        'weight_dif': 'Weight Dif.',
        'weight_net': 'Weight Net',
        'weight_bru': 'Weight Bru.',
        'weight_tar': 'Weight Tar',
        'density': 'Density',
        'a_flags': 'Flags',
        's_flags': 'Flags',
        'lane': 'Lane',
        'comment': 'Comment',
        'date_exported': 'Exported',
        'name': 'Name',
        'quantity': 'Quantity',
        'distance': 'Distance',
        'date_crumbled': 'Crumbled',
        'b_id': 'Box ID',
        'bpos_id': 'Position ID',
        'num_max': 'Max Number',
        'type': 'Type',
        'log_id': 'Log ID',
        'date_created': 'Created',
        'level': 'Level',
        'info': 'Info',
        'box_name': 'Box Name',
        'box_position': 'Box Position',
        'th_id': 'Threshold ID',
        'th_type': 'Type',
        'th_min': 'Min Value',
        'th_max': 'Max Value',
        'th_comment': 'Comment',
        'date_created': 'Created',
        'date_changed': 'Changed'
      }
      return headerMap[col] || col.toUpperCase()
    },

    formatValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }

      if (typeof value === 'string') {
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
          const date = new Date(value)
          return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
        return value
      }

      if (Number.isInteger(value)) {
        return value.toString()
      }

      if (typeof value === 'number') {
        return value.toFixed(2)
      }

      if (typeof value === 'object') {
        return JSON.stringify(value)
      }

      return value.toString()
    },

    getCellClass(value) {
      if (value === null || value === undefined || value === '') {
        return 'null-value'
      }
      return ''
    }
  }
}
</script>

<style scoped>
.table-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.header h2 {
  font-size: 26px;
  font-weight: 700;
  color: #112d4e;
  margin: 0;
}

.btn-add {
  background: #3f72af;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(63, 114, 175, 0.4);
}

.btn-add:hover {
  background: #315b8d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(63, 114, 175, 0.5);
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  max-width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: auto;
}

thead {
  background: #1d4e79;
  position: sticky;
  top: 0;
  z-index: 10;
}

thead th {
  color: white;
  font-weight: 600;
  text-align: left;
  padding: 12px 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

thead th:last-child {
  border-right: none;
}

.actions-header {
  text-align: center !important;
  min-width: 150px;
}

tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f5f5f5;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody td {
  padding: 12px 12px;
  color: #333;
  white-space: nowrap;
  border-right: 1px solid #f5f5f5;
  font-size: 14px;
}

tbody td:last-child {
  border-right: none;
}

.null-value {
  color: #a0a0a0;
  font-style: italic;
  text-align: center;
}

.actions-cell {
  text-align: center;
  white-space: nowrap;
}

.btn-edit,
.btn-delete {
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 4px;
}

.btn-edit {
  background: #4caf50;
  color: white;
}

.btn-edit:hover {
  background: #388e3c;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.4);
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.4);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #606060;
}

.spinner {
  border: 4px solid #f0f0f0;
  border-top: 4px solid #3f72af;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #606060;
}

.no-data p {
  font-size: 15px;
  margin: 0;
}

@media (max-width: 768px) {
  .table-container {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header h2 {
    font-size: 22px;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .actions-cell {
    min-width: 150px;
  }
}
</style>