import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  LayoutTemplate, 
  User, 
  Briefcase, 
  Calendar,
  CreditCard,
  CheckCircle2,
  FileText
} from 'lucide-react';

// Utility for formatting currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// --- UI COMPONENTS (MOVED OUTSIDE APP TO PREVENT RE-RENDER FOCUS LOSS) ---

const InputGroup = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && (
      <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
        {Icon && <Icon size={12} />}
        {label}
      </label>
    )}
    {children}
  </div>
);

const StyledInput = (props) => (
  <input 
    {...props}
    className={`bg-neutral-900 border border-neutral-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] transition-all placeholder-neutral-600 ${props.className || ''}`} 
  />
);

const StyledTextArea = (props) => (
  <textarea 
    {...props}
    className={`bg-neutral-900 border border-neutral-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] transition-all placeholder-neutral-600 resize-none ${props.className || ''}`} 
  />
);

const App = () => {
  // --- STATE MANAGEMENT ---
  const [invoiceData, setInvoiceData] = useState({
    number: '001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    taxRate: 16, // Default VAT/IVA
    notes: 'Gracias por confiar en mi trabajo. El pago debe realizarse dentro de los 15 días posteriores a la recepción de esta factura.',
    paymentMethod: 'Transferencia Bancaria',
    bankDetails: ''
  });

  const [sender, setSender] = useState({
    name: '',
    email: '',
    address: '',
    taxId: '' // RFC/NIF
  });

  const [client, setClient] = useState({
    name: '',
    email: '',
    address: '',
    taxId: ''
  });

  const [items, setItems] = useState([
    { id: 1, description: 'Diseño de Identidad Visual', quantity: 1, price: 500 },
    { id: 2, description: 'Desarrollo Web One-Page', quantity: 1, price: 800 }
  ]);

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview' for mobile

  // --- CALCULATIONS ---
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  // --- HANDLERS ---
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handlePrint = () => {
  // Cambia al tab de vista previa
  setActiveTab('preview');

  // Espera un pequeño tiempo para que se renderice el contenido
  setTimeout(() => {
    window.print();
  }, 300); // 300ms suele ser suficiente
};


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-[#ff4d00] selection:text-white">
      {/* --- HEADER --- */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff4d00] rounded-md flex items-center justify-center font-bold text-black">nd.</div>
            <span className="font-semibold text-white tracking-tight hidden sm:inline">factura</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Tabs */}
            <div className="flex lg:hidden bg-neutral-900 rounded-lg p-1 mr-2">
              <button 
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'edit' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
              >
                Editar
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
              >
                Vista Previa
              </button>
            </div>

            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-4rem)]">
        
        {/* --- LEFT COLUMN: EDITOR --- */}
        <div className={`flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar ${activeTab === 'edit' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Section: Emisor (Diseñador) */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={18} className="text-[#ff4d00]" />
              Tu Información (Emisor)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Nombre / Estudio">
                <StyledInput 
                  placeholder="ej. Juan Pérez o nd. studio" 
                  value={sender.name}
                  onChange={(e) => setSender({...sender, name: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="RFC / ID Fiscal">
                <StyledInput 
                  placeholder="ej. XAXX010101000" 
                  value={sender.taxId}
                  onChange={(e) => setSender({...sender, taxId: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="Email" className="md:col-span-2">
                <StyledInput 
                  placeholder="contacto@estudio.com" 
                  value={sender.email}
                  onChange={(e) => setSender({...sender, email: e.target.value})}
                />
              </InputGroup>
            </div>
          </section>

          {/* Section: Cliente */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-[#ff4d00]" />
              ¿Para quién diseñamos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Nombre Cliente">
                <StyledInput 
                  placeholder="Empresa S.A. de C.V." 
                  value={client.name}
                  onChange={(e) => setClient({...client, name: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="RFC / ID Fiscal">
                <StyledInput 
                  placeholder="ID Fiscal del cliente" 
                  value={client.taxId}
                  onChange={(e) => setClient({...client, taxId: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="Dirección" className="md:col-span-2">
                <StyledInput 
                  placeholder="Calle, Número, Ciudad" 
                  value={client.address}
                  onChange={(e) => setClient({...client, address: e.target.value})}
                />
              </InputGroup>
            </div>
          </section>

          {/* Section: Detalles Factura */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
             <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#ff4d00]" />
              Detalles Generales
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Folio">
                <StyledInput 
                  value={invoiceData.number}
                  onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="Moneda">
                <select 
                  className="bg-neutral-900 border border-neutral-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-all"
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData({...invoiceData, currency: e.target.value})}
                >
                  <option value="USD">USD ($)</option>
                  <option value="MXN">MXN ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </InputGroup>
              <InputGroup label="Fecha Emisión">
                <StyledInput 
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                />
              </InputGroup>
              <InputGroup label="Impuestos (%)">
                <StyledInput 
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData({...invoiceData, taxRate: parseFloat(e.target.value) || 0})}
                />
              </InputGroup>
            </div>
          </section>

          {/* Section: Servicios */}
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <LayoutTemplate size={18} className="text-[#ff4d00]" />
                Desglose Creativo
              </h2>
              <button 
                onClick={addItem}
                className="text-xs font-bold text-[#ff4d00] hover:text-[#ff6a2b] flex items-center gap-1 uppercase tracking-wider"
              >
                <Plus size={14} /> Sumar Servicio
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-neutral-950 p-3 rounded-lg border border-neutral-800 group hover:border-neutral-700 transition-colors">
                  <div className="col-span-12 sm:col-span-6">
                    <input 
                      className="bg-transparent text-white w-full text-sm placeholder-neutral-600 focus:outline-none font-medium"
                      placeholder="Descripción del servicio..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input 
                      type="number"
                      className="bg-transparent text-neutral-400 w-full text-sm text-right focus:outline-none"
                      placeholder="Cant."
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <input 
                      type="number"
                      className="bg-transparent text-neutral-200 w-full text-sm text-right focus:outline-none"
                      placeholder="Precio"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Footer / Notes */}
           <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 mb-20">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[#ff4d00]" />
              Condiciones & Pago
            </h2>
            <div className="grid gap-4">
               <InputGroup label="Método de Pago">
                 <StyledInput 
                  placeholder="ej. Transferencia, PayPal, Efectivo"
                  value={invoiceData.paymentMethod}
                  onChange={(e) => setInvoiceData({...invoiceData, paymentMethod: e.target.value})}
                 />
               </InputGroup>
               <InputGroup label="Datos Bancarios (Opcional)">
                 <StyledInput 
                  placeholder="Banco, CLABE, SWIFT..."
                  value={invoiceData.bankDetails}
                  onChange={(e) => setInvoiceData({...invoiceData, bankDetails: e.target.value})}
                 />
               </InputGroup>
               <InputGroup label="Notas Adicionales">
                 <StyledTextArea 
                   rows={3}
                   value={invoiceData.notes}
                   onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                 />
               </InputGroup>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: PREVIEW --- */}
        <div className={`lg:flex items-center justify-center bg-[#111] rounded-2xl p-4 lg:p-8 relative overflow-hidden ${activeTab === 'preview' ? 'flex' : 'hidden'}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          {/* THE INVOICE PAPER */}
          <div 
            id="invoice-preview"
            className="bg-white text-black w-full max-w-lg min-h-[600px] shadow-2xl shadow-black rounded-sm p-8 sm:p-10 flex flex-col justify-between relative"
            style={{ aspectRatio: '1/1.4142' }} // A4 Ratio approx
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                   <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg mb-4">nd.</div>
                   <h1 className="text-3xl font-bold tracking-tight mb-1">FACTURA</h1>
                   <p className="text-sm text-gray-500 font-mono">#{invoiceData.number}</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-lg">{sender.name || 'Nombre Emisor'}</p>
                   <p className="text-sm text-gray-500 whitespace-pre-wrap">{sender.email}</p>
                   <p className="text-sm text-gray-500">{sender.taxId}</p>
                </div>
              </div>

              {/* Client & Date Grid */}
              <div className="grid grid-cols-2 gap-8 mb-10 border-t border-b border-gray-100 py-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cobrar a</p>
                  <p className="font-bold">{client.name || 'Nombre Cliente'}</p>
                  <p className="text-sm text-gray-600">{client.taxId}</p>
                  <p className="text-sm text-gray-600">{client.address}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                    <p className="text-sm font-medium">{invoiceData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Método</p>
                    <p className="text-sm font-medium">{invoiceData.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left text-xs font-bold uppercase tracking-wider py-2">Servicio</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider py-2 w-16">Cant.</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider py-2 w-24">Precio</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider py-2 w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-2 font-medium">{item.description || 'Descripción...'}</td>
                      <td className="py-3 text-center text-gray-500">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-500">{formatCurrency(item.price, invoiceData.currency)}</td>
                      <td className="py-3 text-right font-bold">{formatCurrency(item.price * item.quantity, invoiceData.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Totals */}
            <div>
              <div className="flex justify-end mb-8">
                <div className="w-48">
                  <div className="flex justify-between py-1 text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal, invoiceData.currency)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm text-gray-600">
                    <span>Impuestos ({invoiceData.taxRate}%)</span>
                    <span>{formatCurrency(taxAmount, invoiceData.currency)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-black mt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total, invoiceData.currency)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4">
                 {invoiceData.bankDetails && (
                   <div className="mb-4 text-xs">
                     <span className="font-bold mr-2">Datos Bancarios:</span>
                     <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{invoiceData.bankDetails}</span>
                   </div>
                 )}
                 <p className="text-xs text-gray-500 italic leading-relaxed">
                   {invoiceData.notes}
                 </p>
              </div>
            </div>

            {/* Print specific styles */}
            <style>{`
              @media print {
                @page { margin: 0; size: auto; }
                body * { visibility: hidden; }
                #invoice-preview, #invoice-preview * { visibility: visible; }
                #invoice-preview { 
                  position: fixed; 
                  left: 0; 
                  top: 0; 
                  width: 100%; 
                  height: 100%;
                  margin: 0; 
                  padding: 40px; 
                  box-shadow: none; 
                  z-index: 9999;
                  background: white !important;
                  color: black !important;
                }
              }
            `}</style>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
