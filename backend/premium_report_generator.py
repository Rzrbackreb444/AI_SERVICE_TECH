"""
PREMIUM REPORT GENERATOR
Creates professional PDF reports using your enterprise analysis algorithms
Works with existing EnterpriseIntelligenceEngine results
"""

import os
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import io
import base64
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.linecharts import HorizontalLineChart
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

class PremiumReportGenerator:
    """Professional PDF report generation for LaundroTech Intelligence"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        """Setup custom styles for professional reports"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#1a365d'),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.HexColor('#2d3748'),
            fontName='Helvetica-Bold',
            borderWidth=1,
            borderColor=colors.HexColor('#e2e8f0'),
            borderPadding=8,
            backColor=colors.HexColor('#f7fafc')
        ))
        
        # Executive summary style
        self.styles.add(ParagraphStyle(
            name='ExecutiveSummary',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=16,
            spaceAfter=12,
            alignment=TA_JUSTIFY,
            backColor=colors.HexColor('#edf2f7'),
            borderWidth=1,
            borderColor=colors.HexColor('#cbd5e0'),
            borderPadding=12
        ))

    async def generate_comprehensive_report(self, analysis_result: Dict[str, Any], 
                                          user_info: Dict[str, Any] = None) -> bytes:
        """Generate comprehensive PDF report from analysis results"""
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Build report content
        story = []
        
        # Cover page
        story.extend(self._build_cover_page(analysis_result, user_info))
        story.append(PageBreak())
        
        # Executive summary
        story.extend(self._build_executive_summary(analysis_result))
        story.append(PageBreak())
        
        # Location overview
        story.extend(self._build_location_overview(analysis_result))
        
        # Market analysis
        story.extend(self._build_market_analysis(analysis_result))
        
        # Competitive intelligence
        story.extend(self._build_competitive_analysis(analysis_result))
        
        # Financial projections
        story.extend(self._build_financial_projections(analysis_result))
        
        # Risk assessment
        story.extend(self._build_risk_assessment(analysis_result))
        
        # Recommendations
        story.extend(self._build_recommendations(analysis_result))
        
        # Appendix
        story.append(PageBreak())
        story.extend(self._build_appendix(analysis_result))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.read()

    def _build_cover_page(self, analysis_result: Dict[str, Any], 
                         user_info: Dict[str, Any] = None) -> List:
        """Build professional cover page"""
        story = []
        
        # LaundroTech Intelligence logo/header
        story.append(Paragraph("LaundroTech Intelligence", self.styles['CustomTitle']))
        story.append(Spacer(1, 0.2*inch))
        
        # Report title
        address = analysis_result.get('address', 'Unknown Location')
        story.append(Paragraph(f"<b>Premium Location Analysis Report</b>", 
                              self.styles['Heading1']))
        story.append(Paragraph(f"{address}", self.styles['Heading2']))
        story.append(Spacer(1, 0.3*inch))
        
        # Overall grade - big and prominent
        overall_grade = analysis_result.get('overall_grade', 'N/A')
        grade_score = analysis_result.get('overall_score', 0)
        
        grade_color = self._get_grade_color(overall_grade)
        story.append(Paragraph(
            f'<para align="center" backColor="{grade_color}" borderWidth="2" '
            f'borderColor="#333333" borderPadding="20">'
            f'<font size="48" color="white"><b>{overall_grade}</b></font><br/>'
            f'<font size="18" color="white">Overall Score: {grade_score}/100</font>'
            f'</para>',
            self.styles['Normal']
        ))
        
        story.append(Spacer(1, 0.4*inch))
        
        # Key metrics table
        key_metrics = [
            ['Revenue Potential', f"${analysis_result.get('revenue_potential', {}).get('monthly_estimate', 0):,}/month"],
            ['Competition Level', analysis_result.get('competition_analysis', {}).get('density_level', 'Unknown')],
            ['Market Score', f"{analysis_result.get('market_score', 0)}/100"],
            ['Location Type', analysis_result.get('location_analysis', {}).get('area_type', 'Unknown')]
        ]
        
        key_table = Table(key_metrics, colWidths=[2.5*inch, 2.5*inch])
        key_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f1f3f4')])
        ]))
        
        story.append(key_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Report metadata
        report_date = datetime.now(timezone.utc).strftime("%B %d, %Y")
        analysis_tier = analysis_result.get('analysis_tier', 'premium').title()
        
        story.append(Paragraph(f"<b>Report Date:</b> {report_date}", self.styles['Normal']))
        story.append(Paragraph(f"<b>Analysis Level:</b> {analysis_tier}", self.styles['Normal']))
        story.append(Paragraph(f"<b>Generated by:</b> LaundroTech Intelligence Platform", self.styles['Normal']))
        
        return story

    def _build_executive_summary(self, analysis_result: Dict[str, Any]) -> List:
        """Build executive summary section"""
        story = []
        
        story.append(Paragraph("Executive Summary", self.styles['SectionHeader']))
        
        # Build intelligent summary based on analysis results
        address = analysis_result.get('address', 'this location')
        overall_grade = analysis_result.get('overall_grade', 'N/A')
        overall_score = analysis_result.get('overall_score', 0)
        
        summary_text = f"""
        This comprehensive analysis of {address} reveals a location with an overall grade of {overall_grade} 
        ({overall_score}/100 points). Our enterprise intelligence engine has evaluated multiple factors including 
        demographics, competition, real estate values, traffic patterns, and market conditions to provide 
        this assessment.
        """
        
        # Add key findings
        revenue_potential = analysis_result.get('revenue_potential', {})
        monthly_low = revenue_potential.get('monthly_low', 0)
        monthly_high = revenue_potential.get('monthly_high', 0)
        
        if monthly_low > 0 and monthly_high > 0:
            summary_text += f"""
            
            <b>Revenue Potential:</b> Our analysis indicates monthly revenue potential between 
            ${monthly_low:,} and ${monthly_high:,}, based on demographic analysis, competition mapping, 
            and market conditions.
            """
        
        # Competition summary
        competition = analysis_result.get('competition_analysis', {})
        competitor_count = len(analysis_result.get('competitors', []))
        
        if competitor_count > 0:
            summary_text += f"""
            
            <b>Competitive Landscape:</b> We identified {competitor_count} competing laundromats within 
            a 2-mile radius. Our competitive intelligence analysis provides detailed insights into 
            market positioning and differentiation opportunities.
            """
        
        # Key recommendations preview
        recommendations = analysis_result.get('recommendations', [])
        if recommendations:
            summary_text += f"""
            
            <b>Key Recommendations:</b> Based on our analysis, we recommend {len(recommendations)} 
            specific actions to optimize success at this location. Detailed recommendations are 
            provided in the recommendations section.
            """
        
        story.append(Paragraph(summary_text, self.styles['ExecutiveSummary']))
        story.append(Spacer(1, 0.3*inch))
        
        return story

    def _build_location_overview(self, analysis_result: Dict[str, Any]) -> List:
        """Build location overview section"""
        story = []
        
        story.append(Paragraph("Location Overview", self.styles['SectionHeader']))
        
        # Address and coordinates
        address = analysis_result.get('address', 'N/A')
        coordinates = analysis_result.get('coordinates', {})
        lat = coordinates.get('lat', 0)
        lng = coordinates.get('lng', 0)
        
        location_data = [
            ['Address', address],
            ['Coordinates', f"{lat:.6f}, {lng:.6f}"],
            ['Analysis Date', analysis_result.get('created_at', datetime.now().isoformat())[:10]]
        ]
        
        location_table = Table(location_data, colWidths=[1.5*inch, 4*inch])
        location_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
        ]))
        
        story.append(location_table)
        story.append(Spacer(1, 0.2*inch))
        
        return story

    def _build_market_analysis(self, analysis_result: Dict[str, Any]) -> List:
        """Build market analysis section"""
        story = []
        
        story.append(Paragraph("Market Analysis", self.styles['SectionHeader']))
        
        # Demographics
        demographics = analysis_result.get('demographics', {})
        
        if demographics:
            story.append(Paragraph("<b>Demographic Profile</b>", self.styles['Heading2']))
            
            demo_data = [
                ['Population', f"{demographics.get('population', 0):,}"],
                ['Median Household Income', f"${demographics.get('median_income', 0):,}"],
                ['Total Households', f"{demographics.get('households', 0):,}"],
                ['Average Household Size', f"{demographics.get('avg_household_size', 0):.1f}"]
            ]
            
            demo_table = Table(demo_data, colWidths=[2.5*inch, 2*inch])
            demo_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
                ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')])
            ]))
            
            story.append(demo_table)
            story.append(Spacer(1, 0.2*inch))
        
        # Market insights
        market_insights = analysis_result.get('market_insights', {})
        if market_insights:
            story.append(Paragraph("<b>Market Insights</b>", self.styles['Heading2']))
            
            insights_text = ""
            for key, value in market_insights.items():
                insights_text += f"<b>{key.replace('_', ' ').title()}:</b> {value}<br/>"
            
            story.append(Paragraph(insights_text, self.styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        return story

    def _build_competitive_analysis(self, analysis_result: Dict[str, Any]) -> List:
        """Build competitive analysis section"""
        story = []
        
        story.append(Paragraph("Competitive Intelligence", self.styles['SectionHeader']))
        
        competitors = analysis_result.get('competitors', [])
        
        if competitors:
            story.append(Paragraph(f"<b>Identified {len(competitors)} competing locations within 2 miles:</b>", 
                                 self.styles['Heading2']))
            
            # Competitor table
            comp_data = [['Name', 'Distance', 'Rating', 'Address']]
            
            for comp in competitors[:10]:  # Show top 10
                comp_data.append([
                    comp.get('name', 'Unknown')[:30],
                    f"{comp.get('distance', 0):.1f} mi",
                    f"{comp.get('rating', 'N/A')}⭐" if comp.get('rating') else 'N/A',
                    comp.get('address', 'Unknown')[:40]
                ])
            
            comp_table = Table(comp_data, colWidths=[2*inch, 0.8*inch, 0.8*inch, 2.4*inch])
            comp_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d3748')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')])
            ]))
            
            story.append(comp_table)
            story.append(Spacer(1, 0.2*inch))
        
        return story

    def _build_financial_projections(self, analysis_result: Dict[str, Any]) -> List:
        """Build financial projections section"""
        story = []
        
        story.append(Paragraph("Financial Projections", self.styles['SectionHeader']))
        
        revenue_potential = analysis_result.get('revenue_potential', {})
        
        if revenue_potential:
            proj_data = [
                ['Metric', 'Conservative', 'Optimistic'],
                ['Monthly Revenue', f"${revenue_potential.get('monthly_low', 0):,}", 
                 f"${revenue_potential.get('monthly_high', 0):,}"],
                ['Annual Revenue', f"${revenue_potential.get('annual_low', 0):,}", 
                 f"${revenue_potential.get('annual_high', 0):,}"],
                ['ROI Timeline', revenue_potential.get('roi_timeline', 'N/A'), 
                 revenue_potential.get('roi_timeline_optimistic', 'N/A')]
            ]
            
            proj_table = Table(proj_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            proj_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a365d')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f8ff')])
            ]))
            
            story.append(proj_table)
            story.append(Spacer(1, 0.2*inch))
        
        return story

    def _build_risk_assessment(self, analysis_result: Dict[str, Any]) -> List:
        """Build risk assessment section"""
        story = []
        
        story.append(Paragraph("Risk Assessment", self.styles['SectionHeader']))
        
        risk_factors = analysis_result.get('risk_factors', [])
        opportunities = analysis_result.get('opportunities', [])
        
        if risk_factors:
            story.append(Paragraph("<b>⚠️ Risk Factors:</b>", self.styles['Heading2']))
            for risk in risk_factors:
                story.append(Paragraph(f"• {risk}", self.styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
        
        if opportunities:
            story.append(Paragraph("<b>✅ Opportunities:</b>", self.styles['Heading2']))
            for opp in opportunities:
                story.append(Paragraph(f"• {opp}", self.styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
        
        return story

    def _build_recommendations(self, analysis_result: Dict[str, Any]) -> List:
        """Build recommendations section"""
        story = []
        
        story.append(Paragraph("Strategic Recommendations", self.styles['SectionHeader']))
        
        # Get AI analysis for recommendations
        ai_analysis = analysis_result.get('ai_analysis', '')
        
        if ai_analysis:
            # Extract recommendations from AI analysis if available
            story.append(Paragraph("<b>AI-Powered Strategic Insights:</b>", self.styles['Heading2']))
            story.append(Paragraph(ai_analysis[:2000] + "..." if len(ai_analysis) > 2000 else ai_analysis, 
                                 self.styles['Normal']))
        else:
            # Generate basic recommendations based on analysis
            recommendations = self._generate_recommendations(analysis_result)
            for rec in recommendations:
                story.append(Paragraph(f"• {rec}", self.styles['Normal']))
        
        story.append(Spacer(1, 0.2*inch))
        
        return story

    def _build_appendix(self, analysis_result: Dict[str, Any]) -> List:
        """Build appendix with technical details"""
        story = []
        
        story.append(Paragraph("Appendix", self.styles['SectionHeader']))
        
        story.append(Paragraph("<b>Methodology</b>", self.styles['Heading2']))
        story.append(Paragraph(
            "This analysis was conducted using LaundroTech Intelligence's proprietary algorithms, "
            "incorporating data from Google Maps API, US Census Bureau, ATTOM Data, and Mapbox. "
            "Location scoring considers demographics, competition density, real estate values, "
            "traffic patterns, and market conditions.",
            self.styles['Normal']
        ))
        
        story.append(Paragraph("<b>Data Sources</b>", self.styles['Heading2']))
        data_sources = [
            "• Google Maps API - Location and competitor data",
            "• US Census Bureau - Demographic information", 
            "• ATTOM Data - Real estate valuations",
            "• Mapbox - Traffic and accessibility analysis",
            "• Proprietary algorithms - Scoring and projections"
        ]
        
        for source in data_sources:
            story.append(Paragraph(source, self.styles['Normal']))
        
        return story

    def _get_grade_color(self, grade: str) -> str:
        """Get color for grade display"""
        if grade.startswith('A'):
            return '#22c55e'  # Green
        elif grade.startswith('B'):
            return '#3b82f6'  # Blue
        elif grade.startswith('C'):
            return '#eab308'  # Yellow
        else:
            return '#ef4444'  # Red

    def _generate_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate basic recommendations based on analysis"""
        recommendations = []
        
        overall_score = analysis_result.get('overall_score', 0)
        competitors = analysis_result.get('competitors', [])
        
        if overall_score >= 80:
            recommendations.append("Strong location with excellent potential - proceed with confidence")
        elif overall_score >= 60:
            recommendations.append("Good location with solid fundamentals - consider market timing")
        else:
            recommendations.append("Location presents challenges - thorough due diligence recommended")
        
        if len(competitors) < 3:
            recommendations.append("Low competition environment - opportunity for market leadership")
        elif len(competitors) > 6:
            recommendations.append("High competition - differentiation strategy essential")
        
        return recommendations