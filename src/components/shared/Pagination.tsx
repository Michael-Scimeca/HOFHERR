import React from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(Math.max(1, totalPages), startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 0', width: '100%' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: currentPage === 1 ? '#475569' : '#f8fafc',
                        border: '1px solid',
                        borderColor: '#334155',
                        borderRadius: '6px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '13px'
                    }}
                >
                    Previous
                </button>
                
                {pages.map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        style={{
                            padding: '6px 12px',
                            background: p === currentPage ? 'var(--red)' : 'transparent',
                            color: p === currentPage ? '#fff' : '#f8fafc',
                            border: '1px solid',
                            borderColor: p === currentPage ? 'var(--red)' : '#334155',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        {p}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: currentPage === totalPages ? '#475569' : '#f8fafc',
                        border: '1px solid',
                        borderColor: '#334155',
                        borderRadius: '6px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '13px'
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
