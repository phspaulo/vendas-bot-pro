
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Building2, MapPin, Globe, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface BusinessFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const BusinessForm = ({ onSubmit, onBack }: BusinessFormProps) => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    segment: "",
    customSegment: "",
    socialMediaLink: "",
    logo: null as File | null,
    whatsapp: "",
    description: ""
  });

  const segments = [
    "Lanchonete",
    "Salão de Beleza",
    "Petshop",
    "Barbearia",
    "Depósito de Água e Gás",
    "Pizzaria",
    "Loja de Roupas",
    "Farmácia",
    "Restaurante",
    "Academia",
    "Clínica Médica",
    "Outro"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.address || !formData.whatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const finalSegment = formData.segment === "Outro" ? formData.customSegment : formData.segment;
    
    onSubmit({
      ...formData,
      segment: finalSegment
    });
    
    toast.success("Dados salvos com sucesso!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }
      setFormData({ ...formData, logo: file });
      toast.success("Logo carregado com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Dados do seu Negócio
            </h1>
            <p className="text-gray-600">
              Preencha as informações para personalizar seu chatbot
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Informações do Negócio
            </CardTitle>
            <CardDescription>
              Estes dados serão usados para personalizar seu chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Nome do Negócio *
                </Label>
                <Input
                  id="businessName"
                  placeholder="Ex: Pizzaria do João"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Endereço Completo *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Rua, número, bairro, cidade - CEP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-gray-200 focus:border-blue-500 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment" className="text-sm font-medium">
                  Segmento do Negócio *
                </Label>
                <Select
                  value={formData.segment}
                  onValueChange={(value) => setFormData({ ...formData, segment: value })}
                  required
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment} value={segment}>
                        {segment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.segment === "Outro" && (
                <div className="space-y-2">
                  <Label htmlFor="customSegment" className="text-sm font-medium">
                    Especifique o Segmento *
                  </Label>
                  <Input
                    id="customSegment"
                    placeholder="Digite o tipo do seu negócio"
                    value={formData.customSegment}
                    onChange={(e) => setFormData({ ...formData, customSegment: e.target.value })}
                    className="border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="socialMedia" className="text-sm font-medium flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Link da Rede Social
                </Label>
                <Input
                  id="socialMedia"
                  placeholder="https://instagram.com/seunegocio"
                  value={formData.socialMediaLink}
                  onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium flex items-center">
                  <Upload className="w-4 h-4 mr-1" />
                  Logo do Negócio
                </Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo')?.click()}
                    className="mb-2"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Escolher Arquivo
                  </Button>
                  {formData.logo ? (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {formData.logo.name}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Envie o logo do seu negócio (máx. 5MB)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-medium flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp do Responsável *
                </Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descrição do Negócio (Opcional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Conte um pouco sobre seu negócio, produtos ou serviços..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-gray-200 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Continuar para Pagamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessForm;
