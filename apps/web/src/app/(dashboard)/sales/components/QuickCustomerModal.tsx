'use client';

import * as React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { createCustomerAction } from '../../../actions/customers';
import { toast } from 'sonner';

interface QuickCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated?: (newCustomerName: string) => void;
}

export function QuickCustomerModal({
  isOpen,
  onClose,
  onCustomerCreated,
}: QuickCustomerModalProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    const res = await createCustomerAction(formData);
    if (res.success) {
      toast.success(`Pelanggan "${name}" berhasil ditambahkan!`);
      onCustomerCreated?.(name);
      onClose();
    } else {
      toast.error(res.error || 'Gagal menambahkan pelanggan');
    }
    setLoading(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pelanggan Cepat"
      description="Daftarkan pelanggan baru ke database CRM toko Anda."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="quick-name" required>
            Nama Lengkap
          </Label>
          <Input
            id="quick-name"
            name="name"
            placeholder="Contoh: Bu Ratna"
            required
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quick-phone">Nomor WhatsApp (Opsional)</Label>
          <Input
            id="quick-phone"
            name="phone"
            placeholder="08123456789"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quick-address">Alamat / Meja (Opsional)</Label>
          <Input
            id="quick-address"
            name="address"
            placeholder="Contoh: Meja 3 / Jl. Melati No. 5"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-2 font-bold">
            Simpan Pelanggan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
