import { Bot, CheckCircle2, MessageSquare, FileText, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const TypewriterText = ({ text, startDelay }: { text: string, startDelay: number }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.2, delay: startDelay + i * 0.08 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </>
  );
};

export default function AIFeature() {
  return (
    <section className="py-[48px] lg:py-[96px] bg-[#F4F6FA] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-[24px] lg:px-[60px] grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[64px] items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31B23]/10 border border-[#E31B23]/20 text-[10px] lg:text-xs font-bold uppercase tracking-wider mb-[16px] lg:mb-[24px] text-[#E31B23]">
            Khusus Member Premium
          </div>
          <h2 className="text-[32px] lg:text-[40px] font-heading font-extrabold text-[#003087] mb-[16px] lg:mb-[24px] leading-[1.2]">
            Pahami Hukum Lebih Cepat dengan AI Legal Assistant
          </h2>
          <p className="text-[#4A5568] text-[16px] lg:text-[18px] mb-[24px] lg:mb-[32px] leading-relaxed">
            Tidak perlu bingung membaca dokumen hukum yang rumit. AI kami dilatih khusus untuk menganalisis regulasi, putusan pengadilan, dan dokumen investigasi Juncto.Media.
          </p>
          
          <ul className="space-y-[16px] mb-[32px] lg:mb-[40px]">
            {[
              { icon: <MessageSquare className="w-5 h-5 text-[#003087]" />, text: 'Chat hukum interaktif langsung di artikel' },
              { icon: <FileText className="w-5 h-5 text-[#003087]" />, text: 'Penjelasan pasal per pasal dengan bahasa sederhana' },
              { icon: <Scale className="w-5 h-5 text-[#003087]" />, text: 'Analisis kasus sederhana berdasarkan preseden' },
              { icon: <CheckCircle2 className="w-5 h-5 text-[#003087]" />, text: 'Terintegrasi langsung dengan database investigasi' }
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 shrink-0">{feature.icon}</div>
                <span className="text-gray-900 font-medium text-[15px] lg:text-[16px]">{feature.text}</span>
              </li>
            ))}
          </ul>

          <Link to="/auth" className="inline-flex items-center justify-center w-full lg:w-auto px-8 py-4 rounded bg-[#003087] hover:bg-[#001f5c] transition-colors font-bold text-white text-[16px] lg:text-lg shadow-lg shadow-[#003087]/20">
            Coba AI Legal Assistant &rarr;
          </Link>
        </motion.div>

        {/* Chat UI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#003087]/10 to-transparent rounded-3xl transform -rotate-3 scale-105"></div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative z-10 flex flex-col h-[400px] lg:h-[500px]">
            <div className="bg-[#003087] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[16px]">AI Legal Juncto</h3>
                <p className="text-[12px] text-white/70">Online &middot; Siap membantu</p>
              </div>
            </div>
            
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 lg:space-y-6 bg-slate-50 relative">
              <div className="flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  style={{ transformOrigin: "top right" }}
                  className="bg-[#003087] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] lg:max-w-[80%] shadow-sm"
                >
                  <p className="text-[13px] lg:text-sm">Apa itu Pasal 28E UUD 1945?</p>
                </motion.div>
              </div>
              
              <div className="relative">
                {/* Typing Indicator */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], display: ["flex", "flex", "flex", "none"] }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5, times: [0, 0.1, 0.9, 1], delay: 1.2 }}
                  style={{ transformOrigin: "top left" }}
                  className="flex gap-2 lg:gap-3 absolute top-0 left-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </motion.div>

                {/* Actual Message */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 2.7 }}
                  style={{ transformOrigin: "top left" }}
                  className="flex gap-2 lg:gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] lg:max-w-[85%] shadow-sm">
                    <p className="text-[13px] lg:text-sm text-gray-800 leading-relaxed">
                      <TypewriterText 
                        text="Pasal 28E UUD 1945 menjamin hak asasi manusia terkait kebebasan beragama, meyakini kepercayaan, serta kebebasan berserikat, berkumpul, dan mengeluarkan pendapat." 
                        startDelay={3.0} 
                      />
                      <br/><br/>
                      <TypewriterText 
                        text='Ayat (3) secara spesifik menyatakan: "Setiap orang berhak atas kebebasan berserikat, berkumpul, dan mengeluarkan pendapat."' 
                        startDelay={4.8} 
                      />
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 6.5 }}
                  style={{ transformOrigin: "top right" }}
                  className="bg-[#003087] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] lg:max-w-[80%] shadow-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <p className="text-[13px] lg:text-sm">Tanya AI tentang berita ini</p>
                </motion.div>
              </div>
            </div>
            
            <div className="p-3 lg:p-4 bg-white border-t border-gray-200">
              <div className="bg-[#F4F6FA] border border-gray-200 rounded-full px-4 py-3 flex items-center text-gray-500 text-[13px] lg:text-sm">
                Ketik pertanyaan hukum Anda di sini...
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
