import React, { useState } from 'react';
import type { Design, ComboType, AdultSizeStock, KidsSizeStock } from '../types';
import { Users, User, Smile, Baby, CheckCircle, XCircle, ArrowLeft, Info, Ruler, X } from 'lucide-react';

interface FamilyPreviewProps {
    design: Design | null;
    onPlaceOrder: (designId: string, comboType: ComboType, selectedSizes: Record<string, string>, notes: Record<string, string>) => Promise<void>;
    onBack: () => void;
}

const FamilyPreview: React.FC<FamilyPreviewProps> = ({ design, onPlaceOrder, onBack }) => {
    const [selectedCombo, setSelectedCombo] = useState<ComboType>('F-M-S-D');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
        'Father': 'L',
        'Mother': 'M',
        'Son': '4-5',
        'Daughter': '4-5'
    });
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const sizeChart = {
        adult: [
            { size: 'M', chest: '38"', length: '28"' },
            { size: 'L', chest: '40"', length: '29"' },
            { size: 'XL', chest: '42"', length: '30"' },
            { size: 'XXL', chest: '44"', length: '31"' },
            { size: '3XL', chest: '46"', length: '32"' },
        ],
        kids: [
            { size: '0-1', height: '70-80cm', chest: '20"' },
            { size: '1-2', height: '80-90cm', chest: '21"' },
            { size: '2-3', height: '90-100cm', chest: '22"' },
            { size: '3-4', height: '100-110cm', chest: '23"' },
            { size: '4-5', height: '110-120cm', chest: '24"' },
            { size: '5-6', height: '120-130cm', chest: '25"' },
            { size: '6-7', height: '130-140cm', chest: '26"' },
            { size: '7-8', height: '140-150cm', chest: '27"' },
            { size: '9-10', height: '150-160cm', chest: '28"' },
            { size: '11-12', height: '160-170cm', chest: '29"' },
            { size: '13-14', height: '170-180cm', chest: '30"' },
        ]
    };

    if (orderSuccess) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <CheckCircle size={80} color="var(--success)" />
                <h2 style={{ margin: 0 }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>Your request has been sent to our staff. Once accepted, your set will be prepared for manufacture.</p>
                <button
                    onClick={() => setOrderSuccess(false)}
                    className="btn btn-primary"
                >
                    Place Another Order
                </button>
            </div>
        );
    }

    if (!design) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                <Users size={64} style={{ marginBottom: '24px' }} />
                <h2>Select a design from the gallery first</h2>
            </div>
        );
    }

    const comboMembers = {
        'F-M-S-D': ['Father', 'Mother', 'Son', 'Daughter'],
        'F-S': ['Father', 'Son'],
        'M-D': ['Mother', 'Daughter'],
        'F-M': ['Father', 'Mother'],
    };

    const adultSizes: (keyof AdultSizeStock)[] = ['M', 'L', 'XL', 'XXL', '3XL'];
    const kidsSizes: (keyof KidsSizeStock)[] = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '9-10', '11-12', '13-14'];

    const getMemberIcon = (member: string) => {
        switch (member) {
            case 'Father': return <User size={48} />;
            case 'Mother': return <Smile size={48} />;
            case 'Son': return <Baby size={40} />;
            case 'Daughter': return <Baby size={40} />;
            default: return <User size={48} />;
        }
    };

    const checkStock = (member: string, size: string) => {
        const category = member === 'Father' ? 'men' :
            member === 'Mother' ? 'women' :
                member === 'Son' ? 'boys' : 'girls';
        const stock = (design.inventory[category] as any)[size] || 0;
        return stock > 0;
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        await onPlaceOrder(design.id, selectedCombo, selectedSizes, notes);
        setIsSubmitting(false);
        setOrderSuccess(true);
    };

    const isAllInStock = comboMembers[selectedCombo].every(m => checkStock(m, selectedSizes[m]));

    return (
        <div style={{ padding: '0 max(16px, 2vw) 48px max(16px, 2vw)', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={onBack} className="btn btn-ghost" style={{ gap: '8px' }}>
                    <ArrowLeft size={18} />
                    Change Design
                </button>
                <button onClick={() => setShowSizeGuide(true)} className="btn btn-ghost" style={{ gap: '8px', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    <Ruler size={18} />
                    Size Guide
                </button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '8px' }}>Personalized Family Preview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Matching Set: <strong>{design.name}</strong> • {design.fabric}</p>
            </div>

            <div className="glass-card" style={{ padding: 'max(16px, 4vw)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Combo Selector */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    {(['F-M-S-D', 'F-S', 'M-D', 'F-M'] as ComboType[]).map(combo => (
                        <button
                            key={combo}
                            onClick={() => setSelectedCombo(combo)}
                            className={`btn ${selectedCombo === combo ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '12px 24px', borderRadius: '50px' }}
                        >
                            {combo}
                        </button>
                    ))}
                </div>

                {/* Preview Grid with horizontal scroll on mobile */}
                <div
                    className="snap-scroll-container"
                    style={{
                        display: 'flex',
                        gap: '24px',
                        overflowX: 'auto',
                        padding: 'max(20px, 4vw)',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '24px',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none'
                    }}
                >
                    {comboMembers[selectedCombo].map((member) => {
                        const isInStock = checkStock(member, selectedSizes[member]);
                        const isKid = member === 'Son' || member === 'Daughter';
                        const sizes = isKid ? kidsSizes : adultSizes;

                        return (
                            <div
                                key={member}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '20px',
                                    minWidth: '200px',
                                    scrollSnapAlign: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <div style={{
                                    width: isKid ? '120px' : '160px',
                                    height: isKid ? '180px' : '260px',
                                    background: 'var(--glass)',
                                    border: `2px solid ${isInStock ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    borderRadius: '30px 30px 10px 10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundImage: `url(${design.imageUrl})`,
                                        backgroundSize: 'cover',
                                        opacity: 0.8,
                                        mixBlendMode: 'multiply'
                                    }} />

                                    <div style={{ zIndex: 2, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                                        {getMemberIcon(member)}
                                    </div>

                                    {!isInStock && (
                                        <div style={{
                                            position: 'absolute',
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            bottom: '20px',
                                            borderRadius: '4px'
                                        }}>
                                            OUT OF STOCK
                                        </div>
                                    )}
                                </div>

                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    {/* Member Info & Sizes */}
                                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{member}</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {sizes.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSizes(prev => ({ ...prev, [member]: size }))}
                                                        className={`btn ${selectedSizes[member] === size ? 'btn-primary' : 'btn-ghost'}`}
                                                        style={{ padding: '4px 12px', fontSize: '0.8rem', minWidth: '45px' }}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Measurement Note Input */}
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder={`Optional: Height, Weight or custom notes for ${member}...`}
                                                style={{ fontSize: '0.85rem', padding: '10px 12px', background: 'rgba(0,0,0,0.2)' }}
                                                value={notes[member] || ''}
                                                onChange={(e) => setNotes(prev => ({ ...prev, [member]: e.target.value }))}
                                            />
                                        </div>

                                        {!isInStock && (
                                            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Info size={14} /> Out of stock in size {selectedSizes[member]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Final Status (Sticky on mobile) */}
                <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    borderRadius: '16px',
                    background: isAllInStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isAllInStock ? 'var(--success)' : 'var(--danger)'}`,
                    position: 'sticky',
                    bottom: 'calc(80px + var(--safe-bottom))',
                    backgroundColor: isAllInStock ? 'rgba(15, 23, 42, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 100,
                    margin: '0 -16px'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', color: isAllInStock ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        {isAllInStock ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        {isAllInStock ? 'Set Available!' : 'Sizes Out of Stock'}
                    </h2>

                    {isAllInStock && (
                        <button
                            disabled={isSubmitting}
                            onClick={handlePlaceOrder}
                            className="btn btn-primary"
                            style={{ marginTop: '16px', width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '12px' }}
                        >
                            {isSubmitting ? 'Processing...' : 'Place Family Order'}
                        </button>
                    )}
                </div>
            </div>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '32px', position: 'relative' }}>
                        <button
                            onClick={() => setShowSizeGuide(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>
                        <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Ruler color="var(--primary)" />
                            Detailed Size Guide
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '12px' }}>Adults (Men/Women)</h3>
                                <table style={{ width: '100%', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '8px' }}>Size</th>
                                            <th style={{ padding: '8px' }}>Chest</th>
                                            <th style={{ padding: '8px' }}>Length</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeChart.adult.map(s => (
                                            <tr key={s.size} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <td style={{ padding: '8px', fontWeight: 700 }}>{s.size}</td>
                                                <td style={{ padding: '8px' }}>{s.chest}</td>
                                                <td style={{ padding: '8px' }}>{s.length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '12px' }}>Kids (Boys/Girls)</h3>
                                <table style={{ width: '100%', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '8px' }}>Age/Size</th>
                                            <th style={{ padding: '8px' }}>Height</th>
                                            <th style={{ padding: '8px' }}>Chest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeChart.kids.map(s => (
                                            <tr key={s.size} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <td style={{ padding: '8px', fontWeight: 700 }}>{s.size}</td>
                                                <td style={{ padding: '8px' }}>{s.height}</td>
                                                <td style={{ padding: '8px' }}>{s.chest}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSizeGuide(false)}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '32px' }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyPreview;
