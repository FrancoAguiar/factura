import React, { useState } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  LayoutTemplate, 
  User, 
  Briefcase, 
  Calendar,
  FileText,
  Image as ImageIcon,
  PenTool
} from 'lucide-react';

// Utility for formatting currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// --- UI COMPONENTS REUTILIZANDO CLASES DEL CONTRATO ---
const InputGroup = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`input-group ${className}`}>
    {label && (
      <label className="input-label font-poppins">
        {Icon && <Icon size={14} className="text-brand-primary" />}
        {label}
      </label>
    )}
    {children}
  </div>
);

const StyledInput = (props) => (
  <input 
    {...props}
    className={`input-field ${props.className || ''}`} 
  />
);

const StyledTextArea = (props) => (
  <textarea 
    {...props}
    className={`input-field resize-none ${props.className || ''}`} 
  />
);

const App = () => {
  // --- STATE MANAGEMENT ---
  const [invoiceData, setInvoiceData] = useState({
    number: '001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    taxRate: 16,
    notes: 'Gracias por confiar en mi trabajo. El pago debe realizarse dentro de los 15 días posteriores a la recepción de esta factura.',
    paymentMethod: 'Transferencia Bancaria',
    bankDetails: ''
  });

  const [sender, setSender] = useState({ name: '', email: '', address: '', taxId: '' });
  const [logo, setLogo] = useState(null);
  const [client, setClient] = useState({ name: '', email: '', address: '', taxId: '' });
  const [items, setItems] = useState([
    { id: 1, description: 'Diseño de Identidad Visual', quantity: 1, price: 500 },
    { id: 2, description: 'Desarrollo Web One-Page', quantity: 1, price: 800 }
  ]);
  const [activeTab, setActiveTab] = useState('edit');

  // --- CALCULATIONS ---
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  // --- HANDLERS ---
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const addItem = () => setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
  const removeItem = (id) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-300 font-sans selection:bg-brand-primary/30 selection:text-white relative">
      
      {/* Background Magic Elements */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      <div className="bg-ambient-glow"></div>

      {/* --- HEADER SAAS STYLE --- */}
      <header className="border-b border-brand-border bg-brand-surface/90 backdrop-blur sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
<div className="bg-brand-primary p-1.5 rounded-lg shadow-glow animate-float">
   <PenTool className="text-black" size={18} />
</div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white text-lg leading-none tracking-tight">
                Factura<span className="text-brand-primary">Pro</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Generador online de facturas</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Tabs */}
            <div className="flex lg:hidden bg-black/40 border border-white/10 rounded-lg p-1 mr-2 mobile-tabs">
              <button 
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'edit' ? 'bg-brand-primary text-black shadow-glow' : 'text-gray-400'}`}
              >
                Editar
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === 'preview' ? 'bg-brand-primary text-black shadow-glow' : 'text-gray-400'}`}
              >
                Vista Previa
              </button>
            </div>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-brand-primary text-black hover:bg-brand-hover px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-glow hover:shadow-glow-hover"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-4rem)] relative z-10">
        
        {/* --- LEFT COLUMN: EDITOR --- */}
        <div className={`flex-col gap-6 overflow-y-auto pr-2 hide-scrollbar pb-24 lg:pb-6 print:hidden ${activeTab === 'edit' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Section: Emisor */}
          <section className="glass-card p-4 lg:p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3 font-display">
              <User size={16} className="text-brand-primary" /> Tu Información (Emisor)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Logo Upload Section */}
              <div className="md:col-span-2 mb-2">
                 <InputGroup label="Logotipo">
                  <div className="flex items-center gap-3 bg-black/30 border border-brand-border p-2 rounded-lg mt-1">
                    {logo ? (
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 overflow-hidden">
                        <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center text-neutral-500">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <label className="cursor-pointer bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold px-3 py-2 rounded transition-colors">
                        {logo ? 'Cambiar Imagen' : 'Subir Imagen'}
                        <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoUpload} />
                      </label>
                      {logo && (
                        <button onClick={() => setLogo(null)} className="text-gray-500 hover:text-red-500 px-2 py-2 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                 </InputGroup>
              </div>

              <InputGroup label="Nombre / Estudio">
                <StyledInput placeholder="ej. Juan Pérez o nd. studio" value={sender.name} onChange={(e) => setSender({...sender, name: e.target.value})} />
              </InputGroup>
              <InputGroup label="RFC / ID Fiscal">
                <StyledInput placeholder="ej. XAXX010101000" value={sender.taxId} onChange={(e) => setSender({...sender, taxId: e.target.value})} />
              </InputGroup>
              <InputGroup label="Email" className="md:col-span-2">
                <StyledInput placeholder="contacto@estudio.com" value={sender.email} onChange={(e) => setSender({...sender, email: e.target.value})} />
              </InputGroup>
            </div>
          </section>

          {/* Section: Cliente */}
          <section className="glass-card p-4 lg:p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3 font-display">
              <Briefcase size={16} className="text-brand-primary" /> ¿Para quién diseñamos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Nombre Cliente">
                <StyledInput placeholder="Empresa S.A. de C.V." value={client.name} onChange={(e) => setClient({...client, name: e.target.value})} />
              </InputGroup>
              <InputGroup label="RFC / ID Fiscal">
                <StyledInput placeholder="ID Fiscal del cliente" value={client.taxId} onChange={(e) => setClient({...client, taxId: e.target.value})} />
              </InputGroup>
              <InputGroup label="Dirección" className="md:col-span-2">
                <StyledInput placeholder="Calle, Número, Ciudad" value={client.address} onChange={(e) => setClient({...client, address: e.target.value})} />
              </InputGroup>
            </div>
          </section>

          {/* Section: Detalles Factura */}
          <section className="glass-card p-4 lg:p-5">
             <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3 font-display">
              <Calendar size={16} className="text-brand-primary" /> Detalles Generales
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Folio">
                <StyledInput value={invoiceData.number} onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})} />
              </InputGroup>
              <InputGroup label="Moneda">
                <select 
                  className="input-field"
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData({...invoiceData, currency: e.target.value})}
                >
                  <option value="USD">USD ($)</option>
                  <option value="MXN">MXN ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </InputGroup>
              <InputGroup label="Fecha Emisión">
                <StyledInput type="date" value={invoiceData.date} onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})} />
              </InputGroup>
              <InputGroup label="Impuestos (%)">
                <StyledInput type="number" value={invoiceData.taxRate} onChange={(e) => setInvoiceData({...invoiceData, taxRate: parseFloat(e.target.value) || 0})} />
              </InputGroup>
            </div>
          </section>

          {/* Section: Servicios */}
          <section className="glass-card p-4 lg:p-5">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <LayoutTemplate size={16} className="text-brand-primary" /> Desglose Creativo
              </h2>
              <button onClick={addItem} className="text-[10px] font-bold bg-[#18181B] text-brand-primary border border-brand-primary/30 px-2 py-1 rounded hover:bg-brand-primary hover:text-black transition-all uppercase tracking-wider flex items-center gap-1">
                <Plus size={12} /> Añadir
              </button>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-black/30 p-3 rounded-lg border border-brand-border group hover:border-brand-primary/50 transition-colors">
                  <div className="col-span-12 sm:col-span-6">
                    <input className="bg-transparent text-white w-full text-sm placeholder-gray-600 focus:outline-none font-medium" placeholder="Descripción del servicio..." value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" className="bg-transparent text-brand-primary font-bold w-full text-sm text-center focus:outline-none" placeholder="Cant." value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <input type="number" className="bg-transparent text-gray-300 w-full text-sm text-right focus:outline-none" placeholder="Precio" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-4 sm:col-span-1 flex justify-end">
                    <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Footer / Notes */}
           <section className="glass-card p-4 lg:p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3 font-display">
              <FileText size={16} className="text-brand-primary" /> Condiciones & Pago
            </h2>
            <div className="grid gap-4">
               <InputGroup label="Método de Pago">
                 <StyledInput placeholder="ej. Transferencia, PayPal, Efectivo" value={invoiceData.paymentMethod} onChange={(e) => setInvoiceData({...invoiceData, paymentMethod: e.target.value})} />
               </InputGroup>
               <InputGroup label="Datos Bancarios (Opcional)">
                 <StyledInput placeholder="Banco, CLABE, SWIFT..." value={invoiceData.bankDetails} onChange={(e) => setInvoiceData({...invoiceData, bankDetails: e.target.value})} />
               </InputGroup>
               <InputGroup label="Notas Adicionales">
                 <StyledTextArea rows={3} value={invoiceData.notes} onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})} />
               </InputGroup>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: PREVIEW --- */}
        <div className={`lg:flex justify-center ${activeTab === 'preview' ? 'flex' : 'hidden'} print:block print:p-0 overflow-y-auto hide-scrollbar`}>
          
          <div 
            id="invoice-preview"
            className="bg-white text-black w-full max-w-lg min-h-[600px] shadow-sheet rounded-sm p-8 sm:p-10 flex flex-col justify-between relative print:shadow-none print:w-full print:max-w-none print:m-0 print:p-8 print:h-auto"
            style={{ aspectRatio: '1/1.4142' }} 
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                   {logo ? (
                     <img src={logo} alt="Logo Empresa" className="max-h-16 max-w-[160px] object-contain mb-4" />
                   ) : (
                     <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg mb-4">nd.</div>
                   )}
                   <h1 className="text-3xl font-bold tracking-tight mb-1 text-black">FACTURA</h1>
                   <p className="text-sm text-gray-500 font-mono">#{invoiceData.number}</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-lg text-black">{sender.name || 'Nombre Emisor'}</p>
                   <p className="text-sm text-gray-500 whitespace-pre-wrap">{sender.email}</p>
                   <p className="text-sm text-gray-500">{sender.taxId}</p>
                </div>
              </div>

              {/* Client & Date Grid */}
              <div className="grid grid-cols-2 gap-8 mb-10 border-t border-b border-gray-200 py-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cobrar a</p>
                  <p className="font-bold text-black">{client.name || 'Nombre Cliente'}</p>
                  <p className="text-sm text-gray-600">{client.taxId}</p>
                  <p className="text-sm text-gray-600">{client.address}</p>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                    <p className="text-sm font-medium text-black">{invoiceData.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Método</p>
                    <p className="text-sm font-medium text-black">{invoiceData.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2">Servicio</th>
                    <th className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2 w-16">Cant.</th>
                    <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2 w-24">Precio</th>
                    <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2 w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-2 font-medium text-black">{item.description || 'Descripción...'}</td>
                      <td className="py-3 text-center text-gray-500">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-500">{formatCurrency(item.price, invoiceData.currency)}</td>
                      <td className="py-3 text-right font-bold text-black">{formatCurrency(item.price * item.quantity, invoiceData.currency)}</td>
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
                  <div className="flex justify-between py-2 border-t-2 border-black mt-2 text-lg font-black text-black">
                    <span>Total</span>
                    <span>{formatCurrency(total, invoiceData.currency)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                 {invoiceData.bankDetails && (
                   <div className="mb-4 text-xs">
                     <span className="font-bold text-black mr-2">Datos Bancarios:</span>
                     <span className="font-mono bg-gray-100 px-2 py-1 rounded text-black">{invoiceData.bankDetails}</span>
                   </div>
                 )}
                 <p className="text-xs text-gray-500 italic leading-relaxed">
                   {invoiceData.notes}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
