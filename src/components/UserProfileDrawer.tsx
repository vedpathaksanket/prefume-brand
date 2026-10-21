/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  LogOut,
  Heart,
  Package,
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Gift,
  Truck,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  Eye,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, UserOrder, OrderItem } from '../context/AuthContext';
import { Perfume, BottleSize } from '../types/perfume';
import { PERFUMES_DATA } from '../data/perfumes';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart?: (perfume: Perfume, size: BottleSize, quantity?: number) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPerfume,
  onAddToCart,
}) => {
  const {
    user,
    profile,
    favorites,
    orders,
    ordersLoading,
    ordersError,
    savedKits,
    signOut,
    toggleFavorite,
    refreshOrders,
    createSampleOrder,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'favorites' | 'orders' | 'kits'>('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [isCreatingSample, setIsCreatingSample] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderForCertificate, setSelectedOrderForCertificate] = useState<UserOrder | null>(null);

  // Filtered orders based on search and status (unconditionally declared at top to follow Rules of Hooks)
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      // Status filter
      if (selectedStatusFilter !== 'all' && order.status !== selectedStatusFilter) {
        return false;
      }

      // Search filter (by Order ID, perfume name, tracking number)
      if (orderSearchQuery.trim()) {
        const query = orderSearchQuery.toLowerCase().trim();
        const matchesId = order.orderId?.toLowerCase().includes(query);
        const matchesTracking = order.trackingNumber?.toLowerCase().includes(query);
        const matchesItems = order.items?.some((item) =>
          item.name.toLowerCase().includes(query) || item.category?.toLowerCase().includes(query)
        );

        if (!matchesId && !matchesTracking && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatusFilter, orderSearchQuery]);
  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => {
      setCopiedOrderId(null);
    }, 2000);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCreateSampleOrder = async () => {
    setIsCreatingSample(true);
    try {
      await createSampleOrder();
    } finally {
      setIsCreatingSample(false);
    }
  };

  const getStatusBadge = (status: UserOrder['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-[10px] font-mono tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            Atelier Confirmed
          </span>
        );
      case 'macerating':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Macerating in Barrel
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-mono tracking-wide uppercase">
            <Truck className="w-3 h-3 text-sky-400" />
            Courier In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono tracking-wide uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Delivered to Residence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-500/15 border border-zinc-500/30 text-zinc-300 text-[10px] font-mono tracking-wide uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden"
        >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-screen max-w-lg liquid-glass bg-[#090b10]/98 border-l border-white/[0.08] shadow-2xl flex flex-col justify-between"
          >
            {/* Header / Profile Info */}
            <div className="p-6 border-b border-white/[0.08] bg-[#0b0e16]/90 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#d4af37]">
                    Connoisseur Private Vault
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Firestore Connected" />
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close profile drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-14 h-14 rounded-full border border-[#d4af37]/40 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center font-serif text-xl">
                    {user.displayName?.charAt(0) || 'A'}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base text-white font-medium truncate">
                      {user.displayName || 'Scent Connoisseur'}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] px-2 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                      {profile?.role || 'Connoisseur'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {orders.length} {orders.length === 1 ? 'Acquisition' : 'Acquisitions'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Explicit "Order History" tab as requested */}
              <div className="grid grid-cols-3 gap-1.5 mt-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Order History ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'favorites'
                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Vault ({favorites.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('kits')}
                  className={`py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'kits'
                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Sets ({savedKits.length})</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {/* TAB: Order History */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Top Bar for Order History */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                        Purchases Archive
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Synchronized with Firestore <code className="text-[#f3e5ab] font-mono">orders</code> collection
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleManualRefresh}
                        disabled={isRefreshing || ordersLoading}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-[#d4af37] transition-colors cursor-pointer border border-white/[0.06] text-xs flex items-center gap-1"
                        title="Sync with Firestore"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || ordersLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
                        <span className="text-[10px] hidden sm:inline">Sync</span>
                      </button>

                      {orders.length > 0 && (
                        <button
                          onClick={handleCreateSampleOrder}
                          disabled={isCreatingSample}
                          className="px-2.5 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#f3e5ab] transition-colors cursor-pointer border border-[#d4af37]/30 text-[10px] font-mono flex items-center gap-1"
                          title="Generate a sample order in Firestore"
                        >
                          <Plus className="w-3 h-3 text-[#d4af37]" />
                          <span>{isCreatingSample ? 'Simulating...' : 'Test Purchase'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter & Search Controls (if user has orders) */}
                  {orders.length > 0 && (
                    <div className="space-y-2">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder="Search orders by perfume, order #, or tracking..."
                          className="w-full text-xs bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d4af37]/60"
                        />
                        {orderSearchQuery && (
                          <button
                            onClick={() => setOrderSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Status Filter Badges */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                        {[
                          { id: 'all', label: 'All Acquisitions' },
                          { id: 'confirmed', label: 'Confirmed' },
                          { id: 'processing', label: 'Macerating' },
                          { id: 'shipped', label: 'In Transit' },
                          { id: 'delivered', label: 'Delivered' },
                        ].map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedStatusFilter(filter.id)}
                            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[10px] font-mono transition-all cursor-pointer ${
                              selectedStatusFilter === filter.id
                                ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f3e5ab]'
                                : 'bg-white/[0.02] border border-white/[0.06] text-zinc-400 hover:text-white'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders Loading State */}
                  {ordersLoading && orders.length === 0 ? (
                    <div className="space-y-3 py-6">
                      <div className="liquid-glass rounded-2xl p-5 border border-white/[0.06] animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 rounded w-1/3" />
                        <div className="h-12 bg-white/5 rounded-xl w-full" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                      <div className="liquid-glass rounded-2xl p-5 border border-white/[0.06] animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 rounded w-1/4" />
                        <div className="h-12 bg-white/5 rounded-xl w-full" />
                      </div>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    /* Empty State for Orders */
                    <div className="py-12 px-4 text-center liquid-glass rounded-2xl border border-white/[0.06]">
                      <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-4 text-[#f3e5ab]">
                        <Package className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <h4
                        className="text-lg text-white font-medium mb-1.5"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {orders.length === 0 ? 'No Past Perfume Acquisitions' : 'No Orders Match Your Filter'}
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mb-6">
                        {orders.length === 0
                          ? 'Every artisanal flacon and bespoke set acquired through your account is securely stored in Firestore and tracked directly from our Paris atelier.'
                          : 'Try adjusting your search terms or status filters to locate specific flacon acquisitions.'}
                      </p>

                      {orders.length === 0 && (
                        <div className="space-y-3 max-w-xs mx-auto">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateSampleOrder}
                            disabled={isCreatingSample}
                            className="w-full liquid-glass-gold rounded-full py-3 px-4 text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{isCreatingSample ? 'Saving to Firestore...' : 'Simulate Past Purchase (Demo)'}</span>
                          </motion.button>

                          <button
                            onClick={onClose}
                            className="w-full rounded-full py-2.5 px-4 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Explore Fragrance Collection
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Render Orders List */
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => {
                        const isExpanded = expandedOrderId === ord.orderId;
                        const orderDate = new Date(ord.createdAt);
                        const formattedDate = orderDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                        const formattedTime = orderDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={ord.orderId}
                            className="liquid-glass rounded-2xl border border-white/[0.08] overflow-hidden transition-all hover:border-[#d4af37]/30"
                          >
                            {/* Order Card Header */}
                            <div className="p-4 bg-white/[0.02] border-b border-white/[0.04]">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-[#f3e5ab] font-medium">
                                    #{ord.orderId}
                                  </span>
                                  <button
                                    onClick={() => handleCopyOrderId(ord.orderId)}
                                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedOrderId === ord.orderId ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>

                                {getStatusBadge(ord.status)}
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-[#d4af37]" />
                                  <span>{formattedDate} · {formattedTime}</span>
                                </div>
                                <span className="font-mono text-white font-medium text-xs">
                                  ${ord.totalAmount}
                                </span>
                              </div>
                            </div>

                            {/* Order Items: List of Past Perfume Purchases */}
                            <div className="p-4 space-y-3">
                              {ord.items && ord.items.length > 0 ? (
                                ord.items.map((item, idx) => {
                                  // Locate canonical perfume data if available
                                  const perfume = PERFUMES_DATA.find(
                                    (p) => p.id === item.id || p.name === item.name
                                  );

                                  return (
                                    <div
                                      key={`${ord.orderId}-item-${idx}`}
                                      className="flex items-center gap-3 p-2.5 rounded-xl bg-black/30 border border-white/[0.04] group hover:border-[#d4af37]/20 transition-all"
                                    >
                                      {/* Perfume Bottle Thumbnail */}
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#0e1118]">
                                        <img
                                          src={item.image || perfume?.image || '/src/assets/images/hero_aura_fragrance_1792573920112.jpg'}
                                          alt={item.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                      </div>

                                      {/* Perfume Details */}
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                          <h5 className="text-xs font-medium text-white truncate group-hover:text-[#f3e5ab] transition-colors">
                                            {item.name}
                                          </h5>
                                          <span className="text-xs font-mono text-zinc-300 ml-2">
                                            ${item.price}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-0.5">
                                          {item.size && (
                                            <span className="text-[10px] font-mono text-[#d4af37] px-1.5 py-0.2 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
                                              {item.size}
                                            </span>
                                          )}
                                          <span className="text-[10px] text-zinc-500">
                                            Qty: {item.quantity}
                                          </span>
                                          {item.category && (
                                            <span className="text-[10px] text-zinc-400 truncate hidden sm:inline">
                                              · {item.category}
                                            </span>
                                          )}
                                        </div>

                                        {/* Discovery kit vials info if applicable */}
                                        {item.isDiscoveryKit && item.kitVials && (
                                          <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                                            Vials: {item.kitVials.join(' · ')}
                                            {item.customMonogram && ` (Monogram: ${item.customMonogram})`}
                                          </p>
                                        )}
                                      </div>

                                      {/* Quick Actions for this perfume */}
                                      <div className="flex items-center gap-1 shrink-0">
                                        {perfume && (
                                          <button
                                            onClick={() => {
                                              onSelectPerfume(perfume);
                                              onClose();
                                            }}
                                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                            title="Inspect Fragrance Pyramid & Notes"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </button>
                                        )}

                                        {onAddToCart && perfume && (
                                          <button
                                            onClick={() => {
                                              const bottleSize = (item.size as BottleSize) || '50ml';
                                              onAddToCart(perfume, bottleSize, 1);
                                            }}
                                            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                                            title="Reorder This Flacon"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                /* Legacy or Simple order fallback */
                                <div className="p-3 rounded-xl bg-black/20 border border-white/[0.04] text-xs text-zinc-400 flex items-center justify-between">
                                  <span>{ord.itemsCount} Hand-Packaged Flacon(s)</span>
                                  <span className="text-[#f3e5ab] font-mono">${ord.totalAmount}</span>
                                </div>
                              )}

                              {/* Complimentary Extrait Gift Display */}
                              {ord.sampleChoice && (
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-zinc-400">
                                  <Gift className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                                  <span className="truncate">
                                    Complimentary 2ml Extrait: <strong className="text-white">{ord.sampleChoice}</strong>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Logistics & Tracking Accordion Toggle */}
                            <div className="px-4 pb-3 pt-1 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? null : ord.orderId)}
                                className="text-zinc-400 hover:text-[#f3e5ab] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                                <span>{isExpanded ? 'Hide Logistics & Courier' : 'Live Tracking & Courier'}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>

                              <button
                                onClick={() => setSelectedOrderForCertificate(ord)}
                                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-mono text-[10px]"
                              >
                                <FileText className="w-3 h-3 text-[#d4af37]" />
                                <span>Atelier Certificate</span>
                              </button>
                            </div>

                            {/* Expandable Logistics Details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-4 pb-4 bg-black/40 border-t border-white/[0.04] text-xs space-y-3"
                                >
                                  <div className="pt-3 space-y-1.5 text-[11px] text-zinc-400">
                                    <div className="flex justify-between">
                                      <span>Tracking Number:</span>
                                      <span className="font-mono text-white">
                                        {ord.trackingNumber || `AUR-EXP-${ord.orderId.replace(/[^0-9]/g, '') || '928174'}`}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Dispatch Facility:</span>
                                      <span className="text-zinc-300">
                                        {ord.shippingAddress || 'Paris Atelier White Glove Courier'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Progress Steps */}
                                  <div className="pt-2 border-t border-white/[0.04]">
                                    <p className="text-[10px] uppercase tracking-wider text-[#d4af37] font-mono mb-2">
                                      Atelier Provenance Stages
                                    </p>
                                    <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-mono">
                                      <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                        1. Verified
                                      </div>
                                      <div className={`p-1.5 rounded ${ord.status !== 'confirmed' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-zinc-400'}`}>
                                        2. Macerated
                                      </div>
                                      <div className={`p-1.5 rounded ${ord.status === 'shipped' || ord.status === 'delivered' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-zinc-400'}`}>
                                        3. Dispatched
                                      </div>
                                      <div className={`p-1.5 rounded ${ord.status === 'delivered' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-zinc-400'}`}>
                                        4. Received
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Scent Vault (Favorites) */}
              {activeTab === 'favorites' && (
                <div>
                  {favorites.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 liquid-glass rounded-2xl border border-white/[0.06]">
                      <Heart className="w-10 h-10 mx-auto mb-3 opacity-30 stroke-[1.5]" />
                      <p className="text-sm text-zinc-300 font-medium">Your Scent Vault is empty</p>
                      <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1">
                        Click the heart icon on any perfume card to save it to your private collection.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((fav) => {
                        const perfume = PERFUMES_DATA.find((p) => p.id === fav.perfumeId);
                        return (
                          <div
                            key={fav.perfumeId}
                            className="liquid-glass rounded-2xl p-4 border border-white/[0.06] flex items-center justify-between gap-3 group"
                          >
                            <div
                              onClick={() => {
                                if (perfume) {
                                  onSelectPerfume(perfume);
                                  onClose();
                                }
                              }}
                              className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                            >
                              {perfume && (
                                <img
                                  src={perfume.image}
                                  alt={fav.perfumeName}
                                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                              )}
                              <div className="truncate">
                                <h4 className="text-sm font-medium text-white truncate group-hover:text-[#f3e5ab] transition-colors">
                                  {fav.perfumeName}
                                </h4>
                                <p className="text-[11px] text-[#d4af37]">{fav.category}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (perfume) toggleFavorite(perfume);
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Saved Discovery Sets */}
              {activeTab === 'kits' && (
                <div>
                  {savedKits.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 liquid-glass rounded-2xl border border-white/[0.06]">
                      <Compass className="w-10 h-10 mx-auto mb-3 opacity-30 stroke-[1.5]" />
                      <p className="text-sm text-zinc-300 font-medium">No saved custom sets</p>
                      <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1">
                        Create custom 3-vial boxes in the Discovery Set builder to save them here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedKits.map((kit) => (
                        <div
                          key={kit.kitId}
                          className="liquid-glass rounded-2xl p-4 border border-white/[0.06] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white font-medium">Custom 3 × 5ml Set</span>
                            {kit.monogram && (
                              <span className="font-mono text-[11px] text-[#f3e5ab] px-2 py-0.5 rounded bg-black/40 border border-white/10">
                                Monogram: {kit.monogram}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-zinc-400 space-y-1">
                            <p>1. {kit.vial1}</p>
                            <p>2. {kit.vial2}</p>
                            <p>3. {kit.vial3}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Sign Out */}
            <div className="p-6 border-t border-white/[0.08] bg-[#07090e]">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="w-full rounded-full py-3 px-4 liquid-glass text-xs text-zinc-300 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <LogOut className="w-4 h-4 text-zinc-400" />
                <span>Sign Out from Atelier</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Certificate of Authenticity Modal */}
        <AnimatePresence>
          {selectedOrderForCertificate && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="liquid-glass bg-[#080a0f] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center"
              >
                <button
                  onClick={() => setSelectedOrderForCertificate(null)}
                  className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
                  <Sparkles className="w-6 h-6" />
                </div>

                <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">
                  Maison Aura · Paris Atelier
                </span>

                <h3
                  className="text-2xl text-white font-serif mt-1 mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Certificate of Olfactory Provenance
                </h3>

                <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
                  This document certifies that the extraits de parfum for Order #{selectedOrderForCertificate.orderId} were hand-compounded in our Paris atelier according to French haute parfumerie traditions.
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] text-xs text-left space-y-2 font-mono mb-6">
                  <div className="flex justify-between text-zinc-400">
                    <span>Order Ref:</span>
                    <span className="text-[#f3e5ab]">#{selectedOrderForCertificate.orderId}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Acquired By:</span>
                    <span className="text-white truncate max-w-[180px]">{user.displayName || user.email}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Formulation Date:</span>
                    <span className="text-white">{new Date(selectedOrderForCertificate.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Concentration:</span>
                    <span className="text-emerald-400">30% Pure Oil Extrait</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Flacons:</span>
                    <span className="text-white">{selectedOrderForCertificate.itemsCount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-2 border-t border-white/[0.06]">
                    <span>Atelier Total:</span>
                    <span className="text-[#d4af37] text-sm">${selectedOrderForCertificate.totalAmount}</span>
                  </div>
                </div>

                <div className="border-t border-[#d4af37]/20 pt-4 flex items-center justify-between text-[11px] text-zinc-500 font-serif italic">
                  <span>Signed: Jean-Claude Moreau</span>
                  <span>Master Parfumeur, Aura</span>
                </div>

                <button
                  onClick={() => setSelectedOrderForCertificate(null)}
                  className="w-full mt-6 liquid-glass-gold rounded-full py-3 text-xs font-medium text-white cursor-pointer"
                >
                  Close Certificate
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    )}
  </AnimatePresence>
);
};
