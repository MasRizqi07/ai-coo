'use client';

import * as React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import {
  Brain,
  CheckCircle2,
  Store,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

import { createProductAction } from '../app/actions/products';
import { updateCompanyAction } from '../app/actions/companies';
import { toast } from 'sonner';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  businessType: string;
}

export function OnboardingWizard({
  isOpen,
  onClose,
  companyName: initialCompanyName,
  businessType: initialBusinessType,
}: OnboardingWizardProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [companyName, setCompanyName] = React.useState(initialCompanyName);
  const [loading, setLoading] = React.useState(false);
  const [importedCount, setImportedCount] = React.useState(0);

  // Template items for quick 1-click import
  const warkopTemplates = [
    { name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 18000, stockQuantity: 100, minStockLevel: 15 },
    { name: 'Es Teh Manis', category: 'Minuman', price: 6000, stockQuantity: 150, minStockLevel: 20 },
    { name: 'Indomie Goreng + Telur', category: 'Makanan', price: 13000, stockQuantity: 80, minStockLevel: 10 },
    { name: 'Roti Bakar Coklat Keju', category: 'Makanan', price: 16000, stockQuantity: 50, minStockLevel: 10 },
  ];

  const retailTemplates = [
    { name: 'Minyak Goreng 1L', category: 'Sembako', price: 19500, stockQuantity: 40, minStockLevel: 10 },
    { name: 'Beras Premium 5kg', category: 'Sembako', price: 74000, stockQuantity: 25, minStockLevel: 5 },
    { name: 'Air Mineral 600ml', category: 'Minuman', price: 3500, stockQuantity: 120, minStockLevel: 24 },
    { name: 'Gula Pasir 1kg', category: 'Sembako', price: 17500, stockQuantity: 50, minStockLevel: 10 },
  ];

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateCompanyAction({ name: companyName });
    setLoading(false);
    setStep(2);
  }

  async function handleImportTemplates(type: 'WARKOP' | 'RETAIL') {
    setLoading(true);
    const items = type === 'WARKOP' ? warkopTemplates : retailTemplates;

    for (const item of items) {
      const fd = new FormData();
      fd.append('name', item.name);
      fd.append('category', item.category);
      fd.append('price', item.price.toString());
      fd.append('stockQuantity', item.stockQuantity.toString());
      fd.append('minStockLevel', item.minStockLevel.toString());
      await createProductAction(fd);
    }

    setImportedCount(items.length);
    setLoading(false);
    toast.success(`Berhasil mengimpor ${items.length} produk template!`);
    setStep(3);
  }

  function handleComplete() {
    localStorage.setItem('ai_coo_onboarding_completed', 'true');
    toast.success('Selamat! Toko Anda siap beroperasi.');
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={step === 3}
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Panduan Toko Baru (FTUX)
              </p>
              <h3 className="text-base font-black text-white">
                {step === 1 && 'Langkah 1: Konfirmasi Profil Usaha'}
                {step === 2 && 'Langkah 2: Siapkan Katalog Produk'}
                {step === 3 && 'Langkah 3: Selamat Datang di AI COO!'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span>{step}</span> / <span>3</span>
          </div>
        </div>

        {/* Step 1: Profil Usaha */}
        {step === 1 && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Pastikan nama toko Anda sesuai. Nama ini akan dicantumkan pada struk kasir digital dan laporan harian AI.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="ob-name" required>
                Nama Usaha / Toko
              </Label>
              <Input
                id="ob-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nama toko Anda"
                required
                autoFocus
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Store className="h-4 w-4 text-amber-400" />
                <span className="text-slate-400">Kategori Bisnis Terdaftar:</span>
              </div>
              <span className="font-bold text-amber-400 capitalize">{initialBusinessType}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" loading={loading} className="font-bold">
                <span>Lanjut ke Katalog</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Produk Pertama atau Template */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Pilih template menu cepat untuk mengisi katalog barang Anda seketika, atau lewati untuk mengisi manual nanti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Template Warkop / Kafe */}
              <div
                onClick={() => !loading && handleImportTemplates('WARKOP')}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs">
                    Kuliner & Warkop
                  </span>
                  <span className="text-[10px] text-slate-500">4 Menu Siap Pakai</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-amber-300">
                  Template Warkop / Cafe
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Kopi Susu Aren, Es Teh, Indomie Goreng, Roti Bakar.
                </p>
              </div>

              {/* Template Retail / Kelontong */}
              <div
                onClick={() => !loading && handleImportTemplates('RETAIL')}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 font-bold text-xs">
                    Retail & Toko
                  </span>
                  <span className="text-[10px] text-slate-500">4 Barang Siap Pakai</span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-blue-300">
                  Template Toko Kelontong
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Minyak Goreng, Beras Premium, Air Mineral, Gula Pasir.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                disabled={loading}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(3)}
                disabled={loading}
                className="text-xs"
              >
                <span>Lewati Langkah Ini</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Siap Berjualan */}
        {step === 3 && (
          <div className="space-y-5 text-center py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/20">
              <Brain className="h-9 w-9" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="text-lg font-black text-white">
                Toko Anda Siap Beroperasi!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {importedCount > 0
                  ? `${importedCount} produk berhasil ditambahkan ke inventaris kasir.`
                  : 'Sistem siap mencatat pesanan kasir dan menganalisis operasional usaha Anda.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Rekomendasi AI COO Pertama:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Buka menu <strong>Kasir POS</strong> untuk melakukan transaksi pertama, atau bagikan struk via WhatsApp ke pelanggan setia Anda.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleComplete}
              className="w-full font-bold shadow-lg shadow-amber-500/20"
            >
              <Zap className="h-4 w-4" />
              <span>Mulai Berjualan Sekarang</span>
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
