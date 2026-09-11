import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = { name: "", description: "", price: "", image_url: "", category: "", stock: "" };

export default function AdminProducts() {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    api.listProducts().then(setProducts).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.category,
      stock: p.stock,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload, auth.token);
      } else {
        await api.createProduct(payload, auth.token);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id, auth.token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-5 h-fit">
        <h2 className="font-bold text-ink mb-4">{editingId ? "Edit product" : "New product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price (USD)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <input
            placeholder="Category"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 rounded-lg border border-gray-300 text-sm text-muted"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-bold text-ink mb-4">Products ({products.length})</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink text-sm">{p.name}</p>
                <p className="text-muted text-xs">
                  ${p.price.toFixed(2)} · {p.stock} in stock
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-brand text-xs font-semibold hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 text-xs font-semibold hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
