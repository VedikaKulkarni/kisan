import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleTranslate from '../components/GoogleTranslate';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        category: "",
        crop_name: '',
        quantity: '',
        price: '',
        image_url: 'https://via.placeholder.com/300x200?text=Farm+Crop',
        sell_date: '',
        village: '',
        district: '',
        state: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // --- Voice Agent State ---
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [agentMessage, setAgentMessage] = useState("");
    const [history, setHistory] = useState([]); // Conversation memory

    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    const CROP_OPTIONS = {
        Vegetables: ["Tomato", "Potato", "Onion", "Brinjal", "Cabbage", "Cauliflower", "Chilli"],
        Fruits: ["Apple", "Banana", "Mango", "Orange", "Grapes", "Pomegranate"],
        Grains: ["Wheat", "Rice", "Maize", "Bajra", "Jowar", "Soybean"],
        Others: ["Sugarcane", "Cotton", "Groundnut"]
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setFormData(prev => ({ ...prev, category, crop_name: "" }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const res = await axios.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image_url: res.data.url }));
            setStatus({ type: 'success', msg: 'Image uploaded successfully!' });
        } catch (err) {
            console.error('Upload error', err);
            setStatus({ type: 'danger', msg: 'Image upload failed.' });
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- 🧠 AI AGENT LOGIC ---
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN'; // Or 'hi-IN' if available and text is Hindi
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
        setAgentMessage(text);
    };

    const processVoiceInput = async (transcript) => {
        setIsProcessing(true);
        setAgentMessage("Thinking...");

        try {
            console.log("Sending to backend:", transcript);
            // Note: The route is mounted at /api/ai/analyze-voice
            const response = await axios.post("/ai/analyze-voice", {
                transcript: transcript,
                formData: formData,
                cropOptions: CROP_OPTIONS,
                history: history
            });

            const result = response.data;
            console.log("AI Result:", result);

            if (result.updates) {
                // Ensure numeric fields are numbers if possible
                const updates = result.updates;
                if (updates.quantity) updates.quantity = String(updates.quantity).replace(/[^0-9.]/g, '');
                if (updates.price) updates.price = String(updates.price).replace(/[^0-9.]/g, '');

                setFormData(prev => ({ ...prev, ...updates }));
            }

            if (result.speech) {
                speak(result.speech);
                setHistory(prev => [
                    ...prev,
                    { role: "user", content: transcript },
                    { role: "assistant", content: result.speech }
                ]);
            }

            if (result.action === "upload_image") {
                setTimeout(() => {
                    if (fileInputRef.current) {
                        fileInputRef.current.click();
                    }
                }, 2000);
            }

        } catch (error) {
            console.error("AI Error:", error);
            speak("Sorry, connection trouble or AI Error.");
            setAgentMessage("Error connecting to AI.");
        } finally {
            setIsProcessing(false);
            setIsListening(false);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Browser incompatible. Use Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; // Supports Indian English accent

        recognitionRef.current.onstart = () => {
            setIsListening(true);
            setAgentMessage("Listening... Speak now.");
        };

        recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            processVoiceInput(transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech Error", event);
            setIsListening(false);
            setAgentMessage("Mic Error. Retry.");
        };

        recognitionRef.current.start();
    };


    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmListing = async () => {
        setShowConfirm(false);
        // Prepare payload to match backend expectations
        const payload = {
            ...formData,
            sell_location: {
                village: formData.village,
                district: formData.district,
                state: formData.state
            }
        };

        try {
            await axios.post('/products', payload);
            setStatus({ type: 'success', msg: 'Product listed successfully!' });
            const successMsg = "Product added successfully!";
            speak(successMsg);
            setHistory([]);
            setTimeout(() => navigate('/my-products'), 1500);
        } catch (err) {
            console.error(err);
            setStatus({ type: 'danger', msg: 'Failed to add product. Please try again.' });
            speak("Failed to add product. Please try again.");
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center mt-4 mb-5">

            <div style={{ maxWidth: '600px', width: '100%' }}>
                <GoogleTranslate />

                {/* 🎙️ VOICE ASSISTANT UI */}
                <Card className="mb-4 shadow-sm border-success bg-light text-center">
                    <Card.Body className="d-flex flex-col flex-column align-items-center">
                        <h4 className="text-success fw-bold mb-2">🧑🌾 Kisan Voice Assistant</h4>
                        <p className="text-muted small mb-3">
                            Tap mic & say: <br />
                            <em>"50kg Onion price 30 Nashik mein bechna hai"</em>
                        </p>

                        <Button
                            variant={isListening ? "danger" : (isProcessing ? "warning" : "success")}
                            className={`rounded-circle d-flex align-items-center justify-content-center shadow ${isListening ? 'pulse-animation' : ''}`}
                            style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                            onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
                            disabled={isProcessing}
                        >
                            {isProcessing ? '⏳' : (isListening ? '⏹️' : '🎙️')}
                        </Button>

                        <div className="mt-3 px-3 py-2 bg-white rounded border w-100" style={{ minHeight: '40px' }}>
                            <span className={`fw-bold ${isListening ? 'text-danger' : 'text-success'}`}>
                                {agentMessage || "Click Mic to Start"}
                            </span>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="shadow-lg border-0">
                    <Card.Header className="bg-primary text-white text-center py-3">
                        <h3 className="mb-0">List New Crop</h3>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Grains">Grains (Crops)</option>
                                    <option value="Others">Others</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Crop Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="crop_name"
                                    value={formData.crop_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Organic Basmati Rice"
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Label className="fw-bold">Quantity (kg)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Label className="fw-bold">Price per kg (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Results Image</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                </div>
                                {uploading && <div className="text-info small mt-1">Uploading...</div>}
                                {formData.image_url && !formData.image_url.includes('placeholder') && (
                                    <div className="mt-2 text-success small">
                                        ✓ Image uploaded
                                    </div>
                                )}
                            </Form.Group>

                            {/* Hidden Image URL input to keep tracking value */}
                            <input type="hidden" name="image_url" value={formData.image_url} />

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Sell Date (Expected Harvest)</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="sell_date"
                                    value={formData.sell_date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <hr className="my-4" />
                            <h6 className="text-muted mb-3">Confirm Location (Leave empty to use Profile default)</h6>
                            <Row>
                                <Col xs={4} className="mb-3">
                                    <Form.Control type="text" name="village" placeholder="Village" value={formData.village} onChange={handleChange} />
                                </Col>
                                <Col xs={4} className="mb-3">
                                    <Form.Control type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} />
                                </Col>
                                <Col xs={4} className="mb-3">
                                    <Form.Control type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                                </Col>
                            </Row>

                            <div className="d-grid gap-2 mt-4">
                                <Button variant="success" size="lg" type="submit" disabled={uploading}>
                                    {uploading ? 'Uploading Image...' : 'List Crop for Sale'}
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate('/farmer-dashboard')}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            {/* Styles removed for brevity as they are inline or unchanged */}
            <style>{`
                .pulse-animation {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(220, 53, 69, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
                }
            `}</style>
            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success fw-bold">Confirm Listing Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2">Please review your crop details before listing:</p>
                    <div className="bg-light p-3 rounded border">
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Category:</Col>
                            <Col xs={7}>{formData.category}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Crop:</Col>
                            <Col xs={7}>{formData.crop_name}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Quantity:</Col>
                            <Col xs={7}>{formData.quantity} kg</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Price:</Col>
                            <Col xs={7}>₹{formData.price}/kg</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Total Value:</Col>
                            <Col xs={7} className="text-success fw-bold">₹{Number(formData.quantity || 0) * Number(formData.price || 0)}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={5} className="fw-bold">Date:</Col>
                            <Col xs={7}>{formData.sell_date}</Col>
                        </Row>
                        <Row className="mb-0">
                            <Col xs={5} className="fw-bold">Location:</Col>
                            <Col xs={7}>
                                {formData.village}, {formData.district}, {formData.state}
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Edit
                    </Button>
                    <Button variant="success" onClick={handleConfirmListing}>
                        Confirm & List
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default AddProduct;
