'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash';
import { colorInput } from '@sanity/color-input';
import { noteField } from 'sanity-plugin-note-field';
import { table } from '@sanity/table';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
    name: 'hofherr',
    title: 'Hofherr Meat Co.',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    basePath: '/studio',
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        /* ── Shop ──────────────────────────────── */
                        S.listItem()
                            .title('🥩 Products')
                            .schemaType('product')
                            .child(S.documentTypeList('product').title('Products')),
                        S.listItem()
                            .title('📂 Categories')
                            .schemaType('category')
                            .child(S.documentTypeList('category').title('Categories')),
                        S.listItem()
                            .title('🔥 Specials')
                            .schemaType('special')
                            .child(S.documentTypeList('special').title('Specials')),

                        S.divider(),

                        /* ── Signature Products ───────────────── */
                        S.listItem()
                            .title('⭐ Signature Products')
                            .schemaType('signatureProduct')
                            .child(S.documentTypeList('signatureProduct').title('Signature Products')),

                        /* ── BBQ ───────────────────────────────── */
                        S.listItem()
                            .title('🔥 BBQ Catering')
                            .child(
                                S.list()
                                    .title('BBQ Catering')
                                    .items([
                                        S.listItem()
                                            .title('Menu Items')
                                            .schemaType('bbqMenuItem')
                                            .child(S.documentTypeList('bbqMenuItem').title('BBQ Menu Items')),
                                        S.listItem()
                                            .title('Pricing Tiers')
                                            .schemaType('bbqPricing')
                                            .child(S.documentTypeList('bbqPricing').title('BBQ Pricing')),
                                        S.listItem()
                                            .title('Beyond BBQ Services')
                                            .schemaType('bbqService')
                                            .child(S.documentTypeList('bbqService').title('BBQ Services')),
                                    ]),
                            ),

                        S.divider(),

                        /* ── Content ───────────────────────────── */
                        S.listItem()
                            .title('❓ FAQs')
                            .schemaType('faq')
                            .child(S.documentTypeList('faq').title('FAQs')),
                        S.listItem()
                            .title('🔪 Cut Guide')
                            .schemaType('cutGuide')
                            .child(S.documentTypeList('cutGuide').title('Cut Guide')),
                        S.listItem()
                            .title('🍖 Catering Packages')
                            .schemaType('cateringPackage')
                            .child(S.documentTypeList('cateringPackage').title('Catering Packages')),

                        S.divider(),

                        /* ── Our Story ─────────────────────────── */
                        S.listItem()
                            .title('👥 Our Story')
                            .child(
                                S.list()
                                    .title('Our Story')
                                    .items([
                                        S.listItem()
                                            .title('Team Members')
                                            .schemaType('teamMember')
                                            .child(S.documentTypeList('teamMember').title('Team Members')),
                                        S.listItem()
                                            .title('Timeline Events')
                                            .schemaType('timelineEvent')
                                            .child(S.documentTypeList('timelineEvent').title('Timeline')),
                                        S.listItem()
                                            .title('Awards & Accolades')
                                            .schemaType('accolade')
                                            .child(S.documentTypeList('accolade').title('Awards')),
                                    ]),
                            ),

                        /* ── Legal ─────────────────────────────── */
                        S.listItem()
                            .title('📜 Legal Pages')
                            .schemaType('legalPage')
                            .child(S.documentTypeList('legalPage').title('Legal Pages')),

                        S.divider(),

                        /* ── Settings ──────────────────────────── */
                        S.listItem()
                            .title('⚙️ Site Settings')
                            .child(
                                S.document()
                                    .schemaType('siteSettings')
                                    .documentId('siteSettings')
                                    .title('Site Settings'),
                            ),
                    ]),
        }),
        presentationTool({
            previewUrl: {
                previewMode: {
                    enable: '/api/draft-mode/enable',
                },
            },
        }),
        visionTool(),
        media(),
        unsplashImageAsset(),
        colorInput(),
        table(),
    ],
    schema: { types: schemaTypes },
});
