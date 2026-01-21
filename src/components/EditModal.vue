<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">

      <header class="modal-header">
        <h3>{{ isNewItem ? 'Add New' : 'Edit' }} {{ entityType.toUpperCase() }} Record</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>

      <main class="modal-body">
        <form @submit.prevent="save">

          <div v-for="fieldName in displayFields" :key="fieldName" class="form-group">
            <label :for="fieldName">
              {{ formatFieldName(fieldName) }}
              <span v-if="isReadOnly(fieldName) && !isNewItem" class="read-only-label"> (Read-Only)</span>
            </label>

            <input
                :id="fieldName"
                :type="getFieldType(fieldName)"
                v-model="editableItem[fieldName]"
                :disabled="isReadOnly(fieldName) && !isNewItem"
                class="form-input"
                :step="getFieldType(fieldName) === 'number' ? 'any' : undefined"
            />
          </div>
        </form>
      </main>

      <footer class="modal-footer">
        <button class="button-cancel" @click="$emit('close')">Cancel</button>
        <button class="button-save" @click="save" :disabled="!isItemValid">
          {{ isNewItem ? 'Create Record' : 'Save Changes' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    item: Object,
    entityType: String,
    fields: Array,
    readOnlyFields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      editableItem: {}
    }
  },

  computed: {
    isNewItem() {
      return this.item === null;
    },

    getPrimaryIdKeys() {
      switch(this.entityType) {
        case 'analysis': return ['a_id'];
        case 'sample': return ['s_id', 's_stamp'];
        case 'box': return ['b_id'];
        case 'boxpos': return ['bpos_id', 'b_id'];
        case 'log': return ['log_id'];
        case 'threshold': return ['th_id'];
        default: return [];
      }
    },

    displayFields() {
      if (this.isNewItem) {
        const idKeys = this.getPrimaryIdKeys;
        return this.fields.filter(field => !idKeys.includes(field));
      }
      return this.fields;
    },

    isItemValid() {
      return this.editableItem && Object.keys(this.editableItem).length > 0;
    }
  },

  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (this.show) {
          if (newItem) {
            this.editableItem = this.formatItemForInput({ ...newItem });
          } else {
            this.editableItem = this.fields.reduce((acc, field) => {
              const type = this.getFieldType(field);
              if (type === 'datetime-local') {
                acc[field] = '';
              } else if (type === 'number') {
                acc[field] = null;
              } else {
                acc[field] = '';
              }
              return acc;
            }, {});
          }
        }
      }
    }
  },

  methods: {
    formatItemForInput(item) {
      for (const key in item) {
        if (this.getFieldType(key) === 'datetime-local' && item[key]) {
          item[key] = item[key].replace(/(\.\d+)?(Z)?$/, '');
        }
      }
      return item;
    },

    formatItemForOutput(item) {
      const output = {};
      for (const key in item) {
        if (this.displayFields.includes(key) || (!this.isNewItem && this.getPrimaryIdKeys.includes(key))) {
          if (item[key] === '' || item[key] === null) {
            output[key] = null;
          } else if (this.getFieldType(key) === 'number') {
            output[key] = Number(item[key]);
          }
          else {
            output[key] = item[key];
          }
        }
      }
      return output;
    },

    getFieldType(fieldName) {
      if (fieldName.startsWith('date') || fieldName.endsWith('_stamp')) {
        return 'datetime-local';
      }
      if (['pol', 'nat', 'kal', 'an', 'glu', 'dry', 'weight', 'density', 'num_max', 'distance', 'quantity', 'th_min', 'th_max', 'lane'].some(name => fieldName.includes(name))) {
        return 'number';
      }
      return 'text';
    },

    isReadOnly(fieldName) {
      if (!this.isNewItem) {
        return this.readOnlyFields.includes(fieldName) || this.getPrimaryIdKeys.includes(fieldName);
      }
      return false;
    },

    save() {
      if (!this.isItemValid) {
        console.error("Invalid inputs");
        return;
      }

      const payload = this.formatItemForOutput(this.editableItem);

      if (this.isNewItem) {
        this.$emit('add', payload);
      } else {
        this.$emit('save', payload);
      }
    },

    formatFieldName(name) {
      const headerMap = {
        'a_id': 'Analysis ID', 's_id': 'Sample ID', 's_stamp': 'Sample Timestamp',
        'pol': 'POL', 'nat': 'NAT', 'kal': 'KAL', 'an': 'AN', 'glu': 'GLU', 'dry': 'DRY',
        'date_in': 'Date In', 'date_out': 'Date Out', 'weight_mea': 'Weight Measured',
        'weight_nrm': 'Weight Normalized', 'weight_cur': 'Weight Current', 'weight_dif': 'Weight Difference',
        'weight_net': 'Weight Net', 'weight_bru': 'Weight Brutto', 'weight_tar': 'Weight Tare',
        'density': 'Density', 'a_flags': 'Analysis Flags', 's_flags': 'Sample Flags', 'lane': 'Lane',
        'comment': 'Comment', 'date_exported': 'Date Exported', 'name': 'Name', 'quantity': 'Quantity',
        'distance': 'Distance', 'date_crumbled': 'Date Crumbled', 'b_id': 'Box ID', 'bpos_id': 'Position ID',
        'num_max': 'Max Number', 'type': 'Type', 'log_id': 'Log ID', 'date_created': 'Created',
        'level': 'Level', 'info': 'Info', 'box_name': 'Box Name', 'box_position': 'Box Position',
        'th_id': 'Threshold ID', 'th_type': 'Threshold Type', 'th_min': 'Min Value', 'th_max': 'Max Value',
        'th_comment': 'Threshold Comment', 'date_changed': 'Date Changed'
      }
      return headerMap[name] || name.replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(17, 45, 78, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 18px 28px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfc;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #112d4e;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 28px;
  border-top: 1px solid #e0e0e0;
  text-align: right;
  background-color: #fcfcfc;
}


.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: #333;
}

.read-only-label {
  font-weight: 400;
  color: #f26419;
  font-style: italic;
  font-size: 0.85rem;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.form-input:focus {
  border-color: #3f72af;
  outline: none;
  box-shadow: 0 0 0 2px rgba(63, 114, 175, 0.3);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #888;
}


.modal-footer button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 10px;
  transition: background-color 0.25s, box-shadow 0.25s;
  border: 1px solid transparent;
}

.button-cancel {
  background-color: #e9ecef;
  color: #495057;
  border-color: #e9ecef;
}

.button-cancel:hover {
  background-color: #d8dee3;
}

.button-save {
  background-color: #3f72af;
  color: white;
  border-color: #3f72af;
}

.button-save:hover:not(:disabled) {
  background-color: #315b8d;
  box-shadow: 0 2px 8px rgba(63, 114, 175, 0.4);
}

.button-save:disabled {
  background-color: #b0c4de;
  border-color: #b0c4de;
  cursor: not-allowed;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 95%;
  }
  .modal-header h3 {
    font-size: 1.2rem;
  }
  .modal-body, .modal-footer {
    padding: 20px;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }
  .modal-footer button {
    padding: 8px 16px;
  }
}
</style>