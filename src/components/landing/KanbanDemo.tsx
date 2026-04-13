"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCard, moveCard } from "@/lib/features/kanban/kanbanSlice";

const AV_COLORS: Record<string, string> = {
  SC: "#6C5CE7",
  MR: "#216e4e",
  PN: "#5e4db2",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function KanbanDemo() {
  const dispatch = useAppDispatch();
  const { columns, selectedCard, selectedCardCol } = useAppSelector((s) => s.kanban);

  const handleCardClick = useCallback(
    (cardId: string, colId: string) => {
      if (selectedCard === cardId) {
        dispatch(selectCard(null));
      } else {
        dispatch(selectCard({ cardId, colId }));
      }
    },
    [dispatch, selectedCard]
  );

  const handleMove = useCallback(
    (toColId: string) => {
      if (!selectedCard || !selectedCardCol) return;
      dispatch(moveCard({ cardId: selectedCard, fromColId: selectedCardCol, toColId }));
    },
    [dispatch, selectedCard, selectedCardCol]
  );

  return (
    <div className="kb-demo-wrap bg-white text-gray-900 dark:bg-[#0B1120] dark:text-gray-100">

      {/* Chrome */}
      <div className="kb-chrome bg-gray-100 dark:bg-[#111827] border-b border-gray-200 dark:border-gray-700">

        <div className="kb-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>

        <div className="kb-title-bar text-gray-900 dark:text-gray-100 font-medium">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="4.5" height="12" rx="1.2" fill="currentColor" />
            <rect x="8.5" y="2" width="5.5" height="8" rx="1.2" fill="currentColor" opacity=".7" />
          </svg>
          <span>Website Redesign · Sprint 12</span>
        </div>

        <div className="kb-chrome-right">
          {["SC", "MR", "PN"].map((av, i) => (
            <div
              key={av}
              className="kb-av text-white text-xs font-semibold"
              style={{
                background: AV_COLORS[av],
                marginLeft: i > 0 ? -8 : 0,
              }}
            >
              {av}
            </div>
          ))}

          <button className="kb-invite-btn bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
            + Invite
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="kb-toolbar bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-700">

        <div className="kb-toolbar-left">
          <button className="kb-tb-btn kb-tb-btn--active text-gray-900 dark:text-white">
            Board
          </button>
          
        </div>

        
      </div>

      {/* Board */}
      <div className="kb-board dark:bg-gray-700">
        {columns.map((col) => (
          <div
            key={col.id}
            className="kb-col bg-gray-100 dark:bg-[#111827] border border-gray-200 dark:border-gray-700"
          >
            <div className="kb-col-header">
              <div className="kb-col-left">
                <span className="kb-col-dot" style={{ background: col.dotColor }} />
                <span className="kb-col-label text-gray-900 dark:text-gray-100 font-medium">
                  {col.label}
                </span>
                <span className="kb-col-count text-gray-600 dark:text-gray-400">
                  {col.cards.length}
                </span>
              </div>

              {selectedCard && selectedCardCol !== col.id && (
                <button
                  className="kb-move-btn bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => handleMove(col.id)}
                >
                  Move →
                </button>
              )}
            </div>

            <div className="kb-col-cards">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`kb-card
                    bg-white text-gray-900
                    dark:bg-[#1F2937] dark:text-gray-100
                    shadow-sm
                    ${selectedCard === card.id ? " kb-card--selected ring-2 ring-purple-500" : ""}
                    ${card.checked ? " kb-card--done opacity-70" : ""}
                  `}
                  onClick={() => handleCardClick(card.id, col.id)}
                >
                  {card.tag && (
                    <span
                      className="kb-card-tag text-xs font-medium"
                      style={{ background: card.tagBg, color: card.tagColor }}
                    >
                      {card.tag}
                    </span>
                  )}

                  <p className={`text-[15px] pb-2 font-medium ${card.checked ? " line-through" : ""}`}>
                    {card.title}
                  </p>

                  <div className="kb-card-footer">
                    <div className="kb-card-meta flex items-center gap-2">
                      <span
                        className="kb-priority-dot"
                        style={{ background: PRIORITY_DOT[card.priority] }}
                      />
                      {card.dueDate && (
                        <span className="kb-due text-xs text-gray-600 dark:text-gray-400">
                          📅 {card.dueDate}
                        </span>
                      )}
                    </div>

                    {card.avatar && (
                      <div
                        className="kb-card-av text-white text-xs font-semibold"
                        style={{ background: card.avatarColor }}
                      >
                        {card.avatar}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="kb-add-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                + Add a card
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="kb-hint bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
          <span>
            Click <strong>Move →</strong> on another column to move this card
          </span>
          <button
            onClick={() => dispatch(selectCard(null))}
            className="kb-hint-close ml-3"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}