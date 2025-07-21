import React, { useState, useRef, useEffect } from 'react';
import { Upload, Edit, Trash2, X, Plus, Calendar, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SliderType {
  _id: string;
  heading: string;
  description: string;
  addedDate: string;
  image: {
    filename: string;
    contentType: string;
  };
  status: string;
  order?: number;
}

interface FormDataType {
  heading: string;
  description: string;
  status: 'active' | 'inactive';
}

const API_BASE_URL = 'http://localhost:5000/api';

const SliderManagement = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingSlider, setEditingSlider] = useState<SliderType | null>(null);
  const [sliders, setSliders] = useState<SliderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataType>({
    heading: '',
    description: '',
    status: 'active'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (editingSlider) {
      setFormData({
        heading: editingSlider.heading || '',
        description: editingSlider.description || '',
        status: editingSlider.status as 'active' | 'inactive'
      });
      setPreviewUrl(`${API_BASE_URL}/sliders/image/${editingSlider._id}`);
    } else {
      resetForm();
    }
  }, [editingSlider]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const resetForm = () => {
    setFormData({
      heading: '',
      description: '',
      status: 'active'
    });
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sliders/all-sliders`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSliders(data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setError('Failed to fetch sliders. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("Image is too large (max 25MB)");
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError("Please select only JPG or PNG images");
      return;
    }

    setError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (!editingSlider) {
      setPreviewUrl(null);
    } else {
      setPreviewUrl(`${API_BASE_URL}/sliders/image/${editingSlider._id}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.heading || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editingSlider && !imageFile) {
      setError("Image is required for new slider");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append("heading", formData.heading);
      submitData.append("description", formData.description);
      submitData.append("status", formData.status);
      
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let response;
      if (editingSlider) {
        // Update existing slider
        response = await fetch(`${API_BASE_URL}/sliders/update-slider/${editingSlider._id}`, {
          method: 'PUT',
          body: submitData
        });
      } else {
        // Create new slider
        response = await fetch(`${API_BASE_URL}/sliders/save-slider`, {
          method: 'POST',
          body: submitData
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

  
      
      setSuccess(editingSlider ? 'Slider updated successfully!' : 'Slider created successfully!');
      
      // Reset form and switch to list view
      resetForm();
      setEditingSlider(null);
      setCurrentView('list');
      
      // Refresh sliders list
      await fetchSliders();
      
    } catch (error: any) {
      console.error('Error saving slider:', error);
      setError(error.message || "Error saving slider. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (slider: SliderType) => {
    setEditingSlider(slider);
    setCurrentView('form');
  };

  const handleDelete = async (sliderId: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sliders/delete-slider/${sliderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setSuccess('Slider deleted successfully!');
      await fetchSliders();
    } catch (error: any) {
      console.error('Error deleting slider:', error);
      setError(error.message || "Error deleting slider. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500 text-white shadow-lg">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-500 text-white shadow-lg">
        <AlertCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
          <span className="text-lg text-gray-600">Loading sliders...</span>
        </div>
      </div>
    );
  }

  if (currentView === 'form') {
    return (
      <div className="space-y-6">
        {success && (
          <Alert className="dark border-green-500/50 bg-green-900/20 text-green-300">
            <CheckCircle className="h-5 w-5 !text-green-400" />
            <AlertTitle className="font-semibold text-green-300">Success</AlertTitle>
            <AlertDescription className="mt-2 text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-dark-primary">
              {editingSlider ? 'Edit Slider' : 'Add New Slider'}
            </CardTitle>
            <CardDescription className="text-dark-secondary text-base">
              {editingSlider ? 'Update slider details below' : 'Create a new slider for your homepage'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-8 animate-fade-in">
              {error && (
                <Alert className="dark border-red-500/50 bg-red-900/20 text-red-300">
                  <AlertCircle className="h-5 w-5 !text-red-400" />
                  <AlertTitle className="font-semibold text-red-300">Error</AlertTitle>
                  <AlertDescription className="mt-2 text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {/* <div className="bg-gradient-to-br from-secondary/5 to-orange-500/5 rounded-2xl p-8 border border-secondary/10">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-secondary/20 rounded-2xl">
                    <FileImage className="w-12 h-12 text-secondary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-dark-primary">
                      {editingSlider ? 'Editing Slider' : 'Creating New Slider'}
                    </h3>
                    <div className="flex items-center space-x-2 text-orange-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Fill in the details to create an engaging slider</span>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="heading" className="text-dark-secondary font-medium mb-2 block">
                      Heading <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="heading"
                      type="text"
                      value={formData.heading}
                      onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                      placeholder="Enter heading"
                      maxLength={100}
                      className="bg-gray-800/40 border-2 border-gray-600 focus:border-secondary dark:focus:border-secondary rounded-lg shadow-sm transition-colors text-white font-medium placeholder:text-gray-400"
                    />
                    <p className="text-xs text-dark-secondary/70 mt-1">Maximum 100 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-dark-secondary font-medium mb-2 block">
                      Description <span className="text-red-400">*</span>
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      maxLength={500}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-800/40 border-2 border-gray-600 focus:border-secondary dark:focus:border-secondary rounded-lg shadow-sm transition-colors text-white font-medium resize-none placeholder:text-gray-400"
                    />
                    <p className="text-xs text-dark-secondary/70 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                  
                  {/* Status Toggle */}
                  <div>
                    <Label className="text-dark-secondary font-medium mb-2 block">
                      Status
                    </Label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors ${
                          formData.status === 'active' 
                            ? 'bg-green-900/40' 
                            : 'bg-red-900/40'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, status: formData.status === 'active' ? 'inactive' : 'active' }))}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                            formData.status === 'active' 
                              ? 'bg-green-600 translate-x-7' 
                              : 'bg-red-600 translate-x-1'
                          }`}
                        />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-md ${
                        formData.status === 'active' 
                          ? 'text-green-400 bg-green-900/30' 
                          : 'text-red-400 bg-red-900/30'
                      }`}>
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-dark-secondary font-medium mb-2 block">
                      Upload Image {!editingSlider && <span className="text-red-400">*</span>}
                    </Label>

                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover border-2 border-gray-600 rounded-lg shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleRemoveImage}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/60 border-white/20 hover:bg-black/80 text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-secondary transition-colors bg-gradient-to-br from-secondary/5 to-orange-500/5">
                        <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
                        <p className="text-dark-primary mb-2 font-medium">Click to upload image</p>
                        <p className="text-sm text-dark-secondary/70 mb-4">JPG or PNG (Max 25MB)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setCurrentView('list');
                    setEditingSlider(null);
                  }}
                  disabled={isSubmitting}
                  className="border-2 border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-secondary hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {editingSlider ? 'Update Slider' : 'Create Slider'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="dark border-green-500/50 bg-green-900/20 text-green-300">
          <CheckCircle className="h-5 w-5 !text-green-400" />
          <AlertTitle className="font-semibold text-green-300">Success</AlertTitle>
          <AlertDescription className="mt-2 text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="dark border-red-500/50 bg-red-900/20 text-red-300">
          <AlertCircle className="h-5 w-5 !text-red-400" />
          <AlertTitle className="font-semibold text-red-300">Error</AlertTitle>
          <AlertDescription className="mt-2 text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
            <FileImage className="w-7 h-7 text-secondary" />
            Slider Management
          </h2>
          <p></p>
        </div>
        <Button
          onClick={() => setCurrentView('form')}
          className="bg-secondary hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slider
        </Button>
      </div>

      <Card className="bg-card border border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-dark-primary">
            Active Sliders
          </CardTitle>
          <CardDescription className="text-dark-secondary">
            Manage your homepage banner sliders
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {sliders.length === 0 ? (
            <div className="p-12 text-center">
              <FileImage className="w-16 h-16 mx-auto mb-4 text-dark-secondary/50" />
              <h3 className="text-lg font-semibold text-dark-primary mb-2">No sliders found</h3>
              <p className="text-dark-secondary mb-6">Add your first slider to get started with homepage banners.</p>
              <Button
                onClick={() => setCurrentView('form')}
                className="bg-secondary hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Slider
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
                      Added Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
                      Slider Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-dark-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/60">
                  {sliders.map((slider) => (
                    <tr key={slider._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-dark-primary">
                          <Calendar className="w-4 h-4 mr-2 text-secondary" />
                          {formatDate(slider.addedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-dark-primary mb-1">{slider.heading}</div>
                          <div className="text-sm text-dark-secondary truncate">
                            {slider.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileImage className="w-4 h-4 mr-2 text-secondary" />
                          <span className="text-sm text-dark-primary font-medium">{slider.image.filename}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(slider.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEdit(slider)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:bg-gray-700 hover:border-secondary text-secondary transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(slider._id)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:bg-red-900/20 hover:border-red-500 text-red-400 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SliderManagement;