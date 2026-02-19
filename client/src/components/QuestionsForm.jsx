import React, { useEffect, useState } from "react";

const INITIAL_STATE = {
  domain: "",
  type: "technical",
  difficulty: "medium",
  question: "",
};

const QuestionsForm = ({ onSave, editingQuestion, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL_STATE);

  useEffect(() => {
    if (editingQuestion) {
      setForm({
        domain: editingQuestion.domain || "",
        type: editingQuestion.type || "technical",
        difficulty: editingQuestion.difficulty || "medium",
        question: editingQuestion.question || "",
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [editingQuestion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSave(form);
    if (!editingQuestion) {
      setForm(INITIAL_STATE);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:border-indigo-200/80 transition-all duration-300 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {editingQuestion ? "Update Question" : "Create New Question"}
      </h3>
      
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            placeholder="Domain (e.g. React, Python, Frontend)"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
          >
            <option value="technical">Technical</option>
            <option value="coding">Coding</option>
            <option value="behavioral">Behavioral</option>
          </select>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="Enter the question text..."
          required
          rows="4"
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            {editingQuestion ? "Update Question" : "Add Question"}
          </button>
          
          {editingQuestion && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionsForm;
