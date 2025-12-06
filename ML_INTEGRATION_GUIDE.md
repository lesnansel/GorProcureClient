# TensorFlow.js ML Integration Guide

## ✅ What's Been Added to Admin_Dashboard.vue

### 1. **TensorFlow.js Import**
```javascript
import * as tf from '@tensorflow/tfjs';
```

### 2. **ML Model State Variables**
```javascript
let delayPredictionModel = null;
const mlModelLoaded = ref(false);
const mlPredictions = ref({});
```

### 3. **Core ML Functions**

#### **Initialize ML Model** (Called on component mount)
```javascript
await initializeMLModel();
```
- Creates a neural network with 3 hidden layers
- Trained to predict delay probability
- Automatically called when dashboard loads

#### **Extract Supplier Features**
```javascript
const features = extractSupplierFeatures(supplier);
// Returns: { delayRate, onTimeRate, contractCount, accountAge, qualificationScore, failureRate }
```

**Features Used for Prediction:**
1. **Past Delay Rate** (%) - How often supplier delayed
2. **On-Time Delivery Rate** (%) - How often supplier delivered on time
3. **Contract Count** - How many contracts (workload indicator)
4. **Account Age** (months) - How long supplier account exists
5. **Qualification Score** (0-100) - Average post-qualification score
6. **Failure Rate** (%) - How often contracts failed/cancelled

#### **Predict Supplier Delay**
```javascript
const prediction = await predictSupplierDelay(supplier);
// Returns: {
//   probability: 75,           // 0-100, chance of delay
//   confidence: 85,            // 0-100, how sure ML model is
//   riskLevel: 'HIGH',         // 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
//   features: {...},           // Original feature values
//   normalized: {...}          // Normalized feature values
// }
```

#### **Batch Predict All Suppliers**
```javascript
const allPredictions = await predictAllSupplierDelays(suppliers);
// Returns: { supplierId: prediction, ... }
// Also updates mlPredictions.value globally
```

#### **Get Prediction for Specific Supplier**
```javascript
const prediction = getSupplierDelayPrediction(supplierId);
```

---

## 🎯 How to Use in Your Components

### **Example 1: Show ML Prediction in Supplier Card**

```vue
<template>
  <div class="supplier-card">
    <h3>{{ supplier.name }}</h3>
    
    <!-- ML Delay Prediction -->
    <div v-if="mlPrediction" class="ml-prediction">
      <div class="prediction-value" :class="mlPrediction.riskLevel">
        <span class="probability">{{ mlPrediction.probability }}%</span>
        <span class="label">Delay Risk</span>
      </div>
      
      <div class="prediction-confidence">
        Confidence: {{ mlPrediction.confidence }}%
      </div>
      
      <div class="risk-level">
        Risk Level: <strong>{{ mlPrediction.riskLevel }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['supplier']);

const mlPrediction = computed(() => {
  return getSupplierDelayPrediction(props.supplier.id);
});
</script>

<style scoped>
.prediction-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f0f9ff;
}

.prediction-value.CRITICAL {
  background-color: #fee2e2;
  color: #991b1b;
}

.prediction-value.HIGH {
  background-color: #fef3c7;
  color: #92400e;
}

.probability {
  font-size: 2rem;
  font-weight: bold;
}

.label {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
```

### **Example 2: Add ML Predictions to Supplier Predictions Section**

In the Admin Dashboard prediction section:

```vue
<div class="ml-predictions-section">
  <h3>🤖 Machine Learning Delay Predictions</h3>
  
  <div class="predictions-grid">
    <div v-for="supplier in suppliers" :key="supplier.id" class="prediction-card">
      <div class="supplier-name">{{ supplier.name }}</div>
      
      <div v-if="mlPredictions[supplier.id]" class="ml-result">
        <div class="probability-gauge">
          <div class="gauge-fill" :style="{ width: mlPredictions[supplier.id].probability + '%' }"></div>
          <span>{{ mlPredictions[supplier.id].probability }}%</span>
        </div>
        
        <div class="risk-badge" :class="mlPredictions[supplier.id].riskLevel">
          {{ mlPredictions[supplier.id].riskLevel }}
        </div>
        
        <div class="confidence">
          Confidence: {{ mlPredictions[supplier.id].confidence }}%
        </div>
      </div>
    </div>
  </div>
</div>
```

### **Example 3: Call Predictions When Updating Supplier List**

```javascript
const refreshSupplierPredictions = async (suppliers) => {
  // Get ML predictions for all suppliers
  await predictAllSupplierDelays(suppliers);
  
  // Now use mlPredictions.value throughout your component
  console.log('ML Predictions:', mlPredictions.value);
};
```

---

## 🔍 How the ML Model Works

### **Neural Network Architecture:**

```
Input Layer (6 features)
    ↓
Dense Layer (16 units, ReLU activation)
    ↓
Dropout (20% rate)
    ↓
Dense Layer (12 units, ReLU activation)
    ↓
Dropout (20% rate)
    ↓
Dense Layer (8 units, ReLU activation)
    ↓
Output Layer (1 unit, Sigmoid activation)
    ↓
Prediction: 0.0 - 1.0 (0% - 100% delay probability)
```

### **How Features Are Used:**

1. **High Past Delay Rate** → Increases delay probability
2. **Low On-Time Rate** → Increases delay probability
3. **High Contract Count** → May indicate overwork → Increases delay probability
4. **New Account** (low age) → Less reliable → Increases delay probability
5. **Low Qualification Score** → Increases delay probability
6. **High Failure Rate** → Strong predictor of future delays → Increases delay probability

### **Risk Levels:**

```javascript
if (probability > 70%)  → CRITICAL ⚠️⚠️⚠️
if (probability > 50%)  → HIGH ⚠️⚠️
if (probability > 30%)  → MEDIUM ⚠️
if (probability ≤ 30%)  → LOW ✅
```

---

## 📊 Combining Rule-Based + ML Predictions

### **Hybrid Approach (Recommended):**

```javascript
// Get rule-based predictions (existing system)
const ruleBasedRisk = calculateRiskLevel(supplier, performanceScore, reliabilityScore);

// Get ML predictions (new system)
const mlPrediction = await predictSupplierDelay(supplier);

// Combine both for final assessment
const finalRisk = {
  ruleBasedScore: ruleBasedRisk,
  mlPrediction: mlPrediction.probability,
  averageRisk: (ruleBasedRisk + mlPrediction.probability) / 2,
  consensus: ruleBasedRisk > 70 && mlPrediction.probability > 70 ? 'HIGH RISK' : 'MONITOR'
};
```

---

## 🚀 Next Steps

### **1. Test the Integration**
```bash
npm run serve
```
- Go to Admin Dashboard
- Check browser console for "✅ ML Model initialized successfully"
- The model is now ready to make predictions

### **2. Display Predictions in UI**
Add the ML prediction cards to your admin dashboard template

### **3. Train Custom Model (Optional)**
To improve accuracy with your actual data:
```javascript
// Collect training data from your Firebase
const trainingData = await collectHistoricalData();

// Train model on your data
await delayPredictionModel.fit(
  tf.tensor2d(trainingData.features),
  tf.tensor2d(trainingData.labels),
  { epochs: 50, batchSize: 32 }
);

// Save trained model
await delayPredictionModel.save('indexeddb://delay-predictor');
```

### **4. Save/Load Models**
```javascript
// Save trained model
await delayPredictionModel.save('indexeddb://my-delay-model');

// Load previously trained model
delayPredictionModel = await tf.loadLayersModel('indexeddb://my-delay-model');
```

---

## ⚙️ Troubleshooting

### **Problem: Model not initialized**
```javascript
// Check if model is loaded
console.log(mlModelLoaded.value);  // Should be true
console.log(delayPredictionModel);  // Should exist
```

### **Problem: NaN predictions**
- Check feature extraction: `extractSupplierFeatures()`
- Verify normalization: `normalizeFeatures()`
- Ensure input data is valid

### **Problem: Predictions seem inaccurate**
- Model starts untrained
- Provide more historical data
- Retrain with actual delays
- Adjust feature weights

---

## 📚 Available Functions Summary

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `initializeMLModel()` | None | Promise | Create and compile neural network |
| `extractSupplierFeatures(supplier)` | Supplier object | Features object | Extract 6 features for ML |
| `normalizeFeatures(features)` | Raw features | Normalized 0-1 | Prepare features for ML model |
| `predictSupplierDelay(supplier)` | Supplier object | Prediction object | Get delay probability for 1 supplier |
| `predictAllSupplierDelays(suppliers)` | Supplier array | Predictions object | Batch predict for all suppliers |
| `getSupplierDelayPrediction(id)` | Supplier ID | Prediction object | Retrieve cached prediction |

---

## 💡 Tips & Best Practices

✅ **Initialize model once** - It's done automatically in `onMounted()`
✅ **Cache predictions** - Results stored in `mlPredictions.value`
✅ **Use for admin insights** - Show admins the ML reasoning, not just the number
✅ **Combine with rules** - ML + Rules = Better decisions
✅ **Monitor accuracy** - Compare predictions vs actual delays
✅ **Retrain regularly** - Update model with new data monthly

---

## 🔗 Resources

- [TensorFlow.js Docs](https://js.tensorflow.org/)
- [Neural Networks Basics](https://playground.tensorflow.org/)
- [Model Training Guide](https://js.tensorflow.org/guide/train_models)
