import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { providerApi } from '../services/adminApi';
import { 
  CheckCircle,
  FileText,
  Upload,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Shield,
  AlertCircle,
  Camera,
  Award,
  Clock,
  Percent,
  Loader2
} from 'lucide-react';

const ProviderRegistration = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    // Informations de base
    providerType: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',
    
    // Informations professionnelles
    businessDescription: '',
    specialties: [],
    languages: [],
    experience: '',
    capacity: '',
    
    // Documents
    documents: {
      idCard: null,
      businessLicense: null,
      insurance: null,
      certifications: null,
      photos: []
    },
    
    // Charte qualité
    charteAccepted: false,
    qualityCommitments: [],
    
    // Transparence rémunération
    commissionAccepted: false,
    understandsCommission: false
  });

  const [errors, setErrors] = useState({});

  const providerTypes = [
    { id: 'guide', name: 'Guide Local', icon: '🗺️', commission: 15 },
    { id: 'restaurant', name: 'Restaurant/Café', icon: '🍽️', commission: 12 },
    { id: 'hotel', name: 'Hébergement', icon: '🏨', commission: 10 },
    { id: 'transport', name: 'Transport', icon: '🚗', commission: 15 },
    { id: 'artisan', name: 'Artisan/Vendeur', icon: '🎨', commission: 8 },
    { id: 'events', name: 'Organisateur Événements', icon: '🎭', commission: 15 }
  ];

  const cities = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Batna', 'Béjaïa', 'Biskra', 'Blida',
    'Bouira', 'Chlef', 'Djelfa', 'Ghardaïa', 'Jijel', 'Laghouat', 'Mascara', 'M\'Sila',
    'Mostaganem', 'Ouargla', 'Oum el Bouaghi', 'Saïda', 'Sétif', 'Sidi Bel Abbès',
    'Skikda', 'Souk Ahras', 'Tamanrasset', 'Tébessa', 'Tiaret', 'Tindouf', 'Tipaza',
    'Tissemsilt', 'Tizi Ouzou', 'Tlemcen'
  ];

  const qualityRequirements = [
    {
      id: 'photos',
      title: 'Photos de Qualité',
      description: 'Minimum 3 photos haute résolution de vos services/locaux',
      mandatory: true
    },
    {
      id: 'description',
      title: 'Description Détaillée',
      description: 'Description complète de vos services (minimum 100 mots)',
      mandatory: true
    },
    {
      id: 'certifications',
      title: 'Certifications Valides',
      description: 'Diplômes, certifications professionnelles à jour',
      mandatory: true
    },
    {
      id: 'insurance',
      title: 'Assurance Responsabilité Civile',
      description: 'Assurance valide couvrant votre activité',
      mandatory: true
    },
    {
      id: 'safety',
      title: 'Normes de Sécurité',
      description: 'Respect des normes de sécurité selon votre secteur',
      mandatory: true
    },
    {
      id: 'transparency',
      title: 'Transparence Tarifaire',
      description: 'Prix clairs et détaillés, aucun coût caché',
      mandatory: true
    },
    {
      id: 'availability',
      title: 'Disponibilité Confirmée',
      description: 'Calendrier de disponibilité tenu à jour',
      mandatory: false
    },
    {
      id: 'response',
      title: 'Réactivité Client',
      description: 'Réponse aux messages dans les 24h maximum',
      mandatory: false
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleProviderTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      providerType: type.id,
      commission: type.commission
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleQualityCommitmentToggle = (requirementId) => {
    setFormData(prev => ({
      ...prev,
      qualityCommitments: prev.qualityCommitments.includes(requirementId)
        ? prev.qualityCommitments.filter(id => id !== requirementId)
        : [...prev.qualityCommitments, requirementId]
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.providerType) newErrors.providerType = 'Sélectionnez un type de prestataire';
        if (!formData.businessName) newErrors.businessName = 'Nom requis';
        if (!formData.ownerName) newErrors.ownerName = 'Nom du responsable requis';
        if (!formData.email) newErrors.email = 'Email requis';
        if (!formData.phone) newErrors.phone = 'Téléphone requis';
        if (!formData.city) newErrors.city = 'Ville requise';
        break;
        
      case 2:
        if (!formData.businessDescription || formData.businessDescription.length < 100) {
          newErrors.businessDescription = 'Description de minimum 100 caractères requise';
        }
        if (formData.specialties.length === 0) newErrors.specialties = 'Au moins une spécialité requise';
        if (formData.languages.length === 0) newErrors.languages = 'Au moins une langue requise';
        break;
        
      case 3:
        const mandatoryRequirements = qualityRequirements
          .filter(req => req.mandatory)
          .map(req => req.id);
        
        const missingRequirements = mandatoryRequirements.filter(
          req => !formData.qualityCommitments.includes(req)
        );
        
        if (missingRequirements.length > 0) {
          newErrors.qualityCommitments = 'Tous les engagements obligatoires doivent être acceptés';
        }
        if (!formData.charteAccepted) newErrors.charteAccepted = 'Charte qualité obligatoire';
        break;
        
      case 4:
        if (!formData.commissionAccepted) newErrors.commissionAccepted = 'Acceptation de la commission requise';
        if (!formData.understandsCommission) newErrors.understandsCommission = 'Confirmation de compréhension requise';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitRegistration = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Préparer les données pour l'API
      const registrationData = {
        provider_type: formData.providerType,
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        business_description: formData.businessDescription,
        specialties: formData.specialties,
        languages: formData.languages,
        experience: formData.experience,
        capacity: formData.capacity,
        quality_commitments: formData.qualityCommitments,
        charte_accepted: formData.charteAccepted,
        commission_accepted: formData.commissionAccepted,
        understands_commission: formData.understandsCommission
      };
      
      const response = await providerApi.register(registrationData);
      
      setSubmitSuccess(true);
      console.log('Inscription réussie:', response);
      
    } catch (error) {
      setSubmitError(error.message);
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProviderType = providerTypes.find(type => type.id === formData.providerType);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎒</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
              Inscription Prestataire EJI
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Rejoignez notre communauté de prestataires de qualité en Algérie
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                stepNum <= step 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-16 h-1 ${
                  stepNum < step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Informations de base */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations de Base
              </CardTitle>
              <CardDescription>
                Renseignez vos informations principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type de prestataire */}
              <div>
                <Label className="text-base font-semibold">Type de Prestataire *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {providerTypes.map((type) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        formData.providerType === type.id 
                          ? 'ring-2 ring-green-500 bg-green-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleProviderTypeSelect(type)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-sm">{type.name}</div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {type.commission}% commission
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.providerType && <p className="text-red-500 text-sm mt-1">{errors.providerType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">
                    {formData.providerType === 'guide' ? 'Nom complet' : 'Nom de l\'entreprise'} *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder={formData.providerType === 'guide' ? 'Votre nom complet' : 'Nom de votre entreprise'}
                    className={errors.businessName ? 'border-red-500' : ''}
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <Label htmlFor="ownerName">Nom du responsable *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Nom du responsable"
                    className={errors.ownerName ? 'border-red-500' : ''}
                  />
                  {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+213 XXX XXX XXX"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <select
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Adresse complète"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Informations professionnelles */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Informations Professionnelles
              </CardTitle>
              <CardDescription>
                Décrivez votre activité et vos services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="businessDescription">Description de votre activité * (min. 100 caractères)</Label>
                <textarea
                  id="businessDescription"
                  rows="5"
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  placeholder="Décrivez en détail votre activité, vos services, votre expérience..."
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.businessDescription && <p className="text-red-500 text-sm">{errors.businessDescription}</p>}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.businessDescription.length}/100 caractères minimum
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Ex: 5 ans"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacité d'accueil</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="Ex: 10 personnes max"
                  />
                </div>
              </div>

              {/* Spécialités */}
              <div>
                <Label className="text-base font-semibold">Spécialités *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {['Culture', 'Histoire', 'Aventure', 'Gastronomie', 'Photographie', 'Nature', 'Sport', 'Artisanat'].map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
                {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
              </div>

              {/* Langues */}
              <div>
                <Label className="text-base font-semibold">Langues parlées *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {['Français', 'Arabe', 'Anglais', 'Espagnol', 'Italien', 'Allemand', 'Chinois', 'Russe'].map((language) => (
                    <label key={language} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={() => handleLanguageToggle(language)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{language}</span>
                    </label>
                  ))}
                </div>
                {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
              </div>

              {/* Note sur transparence */}
              {selectedProviderType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Percent className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Transparence Rémunération</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Commission EJI pour {selectedProviderType.name}: <strong>{selectedProviderType.commission}%</strong>
                      </p>
                      <p className="text-xs text-blue-700 mt-2">
                        Cette commission sera détaillée à l'étape suivante avec calcul transparent de vos gains.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Charte Qualité */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Charte Qualité EJI
              </CardTitle>
              <CardDescription>
                Engagements qualité pour garantir l'excellence de nos services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Notre Mission Qualité</h3>
                <p className="text-sm text-green-800">
                  EJI s'engage à offrir aux voyageurs les meilleures expériences en Algérie. 
                  Chaque prestataire doit respecter nos standards de qualité pour maintenir 
                  la confiance de nos clients.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Engagements Qualité :</h4>
                {qualityRequirements.map((requirement) => (
                  <div key={requirement.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={requirement.id}
                      checked={formData.qualityCommitments.includes(requirement.id)}
                      onChange={() => handleQualityCommitmentToggle(requirement.id)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label htmlFor={requirement.id} className="font-medium text-gray-900 cursor-pointer">
                          {requirement.title}
                        </label>
                        {requirement.mandatory && (
                          <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="charteAccepted"
                    checked={formData.charteAccepted}
                    onChange={(e) => handleInputChange('charteAccepted', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="charteAccepted" className="font-medium text-gray-900 cursor-pointer">
                      J'accepte la Charte Qualité EJI *
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      En cochant cette case, je m'engage à respecter tous les standards de qualité EJI 
                      et à maintenir un niveau d'excellence dans mes services.
                    </p>
                  </div>
                </div>
                {errors.charteAccepted && <p className="text-red-500 text-sm mt-2">{errors.charteAccepted}</p>}
                {errors.qualityCommitments && <p className="text-red-500 text-sm mt-2">{errors.qualityCommitments}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Transparence Rémunération */}
        {step === 4 && selectedProviderType && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Transparence Rémunération
              </CardTitle>
              <CardDescription>
                Comprendre notre système de commission transparent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Système de Commission Transparent</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedProviderType.commission}%</div>
                    <div className="text-sm text-gray-600">Commission EJI</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{100 - selectedProviderType.commission}%</div>
                    <div className="text-sm text-gray-600">Votre part</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">0%</div>
                    <div className="text-sm text-gray-600">Frais cachés</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Exemple de Calcul :</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix de votre service :</span>
                      <span className="font-medium">10,000 DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission EJI ({selectedProviderType.commission}%) :</span>
                      <span className="font-medium text-red-600">-{(10000 * selectedProviderType.commission / 100).toLocaleString()} DZD</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Votre gain net :</span>
                      <span className="text-green-600">{(10000 * (100 - selectedProviderType.commission) / 100).toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Ce que comprend notre commission :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Marketing & Visibilité</div>
                      <div className="text-sm text-gray-600">Promotion de vos services</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Support Client 24/7</div>
                      <div className="text-sm text-gray-600">Assistance clientèle</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Système de Paiement</div>
                      <div className="text-sm text-gray-600">Transactions sécurisées</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Assurance & Protection</div>
                      <div className="text-sm text-gray-600">Couverture supplémentaire</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="commissionAccepted"
                    checked={formData.commissionAccepted}
                    onChange={(e) => handleInputChange('commissionAccepted', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="commissionAccepted" className="font-medium text-gray-900 cursor-pointer">
                      J'accepte le taux de commission de {selectedProviderType.commission}% *
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Je comprends et accepte que EJI prélève {selectedProviderType.commission}% de commission 
                      sur chaque réservation de mes services.
                    </p>
                  </div>
                </div>
                {errors.commissionAccepted && <p className="text-red-500 text-sm mt-2">{errors.commissionAccepted}</p>}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="understandsCommission"
                    checked={formData.understandsCommission}
                    onChange={(e) => handleInputChange('understandsCommission', e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="understandsCommission" className="font-medium text-gray-900 cursor-pointer">
                      Je confirme avoir compris le système de rémunération *
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Je confirme comprendre parfaitement comment fonctionne le calcul de la commission 
                      et de mes gains nets.
                    </p>
                  </div>
                </div>
                {errors.understandsCommission && <p className="text-red-500 text-sm mt-2">{errors.understandsCommission}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Précédent
          </Button>
          
          {step < 4 ? (
            <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={submitRegistration} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Soumettre Inscription
                </>
              )}
            </Button>
          )}
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Inscription soumise avec succès !</h3>
                  <p className="text-green-800 mt-1">
                    Votre demande d'inscription a été reçue. Vous recevrez une réponse sous 48h.
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Un email de confirmation vous sera envoyé à l'adresse : {formData.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {submitError && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Erreur lors de l'inscription</h3>
                  <p className="text-red-800 mt-1">{submitError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSubmitError(null)}
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Process Timeline */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Processus de Validation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div className="font-medium">Soumission</div>
                <div className="text-gray-600">Inscription complétée</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-semibold">2</span>
                </div>
                <div className="font-medium">Validation</div>
                <div className="text-gray-600">Vérification sous 48h</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div className="font-medium">Activation</div>
                <div className="text-gray-600">Accès au dashboard</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderRegistration;