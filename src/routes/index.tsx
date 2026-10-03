import { Navigate, Route, Routes } from 'react-router-dom'
import { StoreLayout } from '../layouts/StoreLayout'
import { CheckoutLayout } from '../layouts/CheckoutLayout'
import { SecurityLayout } from '../layouts/SecurityLayout'
import { OperationsLayout } from '../layouts/OperationsLayout'
import { SystemLayout } from '../layouts/SystemLayout'
import { HubPage } from '../pages/HubPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { HomePage } from '../pages/store/HomePage'
import { CatalogPage, CategoryPage, SearchPage } from '../pages/store/CatalogPage'
import { ProductPage } from '../pages/store/ProductPage'
import { SellerPage } from '../pages/store/SellerPage'
import { CartPage } from '../pages/store/CartPage'
import { DeliveryPage } from '../pages/store/checkout/DeliveryPage'
import { PaymentPage } from '../pages/store/checkout/PaymentPage'
import { ReviewPage } from '../pages/store/checkout/ReviewPage'
import { AnalysisPage } from '../pages/store/checkout/AnalysisPage'
import { CheckoutVerificationPage } from '../pages/store/checkout/VerificationPage'
import { AttentionPage } from '../pages/store/checkout/AttentionPage'
import { ApprovedPage } from '../pages/store/checkout/ApprovedPage'
import { InterruptedPage } from '../pages/store/checkout/InterruptedPage'
import { OrderConfirmationPage, OrderDetailPage, OrdersPage } from '../pages/store/OrderPages'
import { SecurityHomePage } from '../pages/security/SecurityHomePage'
import { CardsPage } from '../pages/security/CardsPage'
import { SecurityTransactionDetailPage, SecurityTransactionsPage } from '../pages/security/TransactionsPages'
import { DevicesPage } from '../pages/security/DevicesPage'
import { AlertsPage } from '../pages/security/AlertsPage'
import { ProtectionPage } from '../pages/security/ProtectionPage'
import { CheckPage } from '../pages/security/CheckPage'
import { MessageCheckPage } from '../pages/security/MessageCheckPage'
import { SecurityConfirmationPage, SecurityVerificationPage } from '../pages/security/SecurityVerificationPages'
import {
  ReportDescriptionPage,
  ReportDonePage,
  ReportIntroPage,
  ReportReviewPage,
  ReportTransactionPage,
  ReportTypePage,
} from '../pages/security/report/ReportPages'
import { IncidentFollowPage } from '../pages/security/IncidentFollowPage'
import { OverviewPage } from '../pages/operations/OverviewPage'
import { OpsTransactionsPage } from '../pages/operations/TransactionsPage'
import { OpsTransactionDetailPage } from '../pages/operations/TransactionDetailPage'
import { OpsIncidentDetailPage, OpsIncidentsPage } from '../pages/operations/IncidentsPages'
import { EvidencePage } from '../pages/operations/EvidencePage'
import { TimelinePage } from '../pages/operations/TimelinePage'
import { IntelligencePage, PatternDetailPage, RelationshipDetailPage } from '../pages/operations/IntelligencePages'
import { AuditPage } from '../pages/operations/AuditPage'
import { ArchitecturePage } from '../pages/operations/ArchitecturePage'
import { FragilityPage } from '../pages/operations/FragilityPage'
import { IndependencePage } from '../pages/operations/IndependencePage'
import { ChaosLabPage, ChaosScenarioPage } from '../pages/operations/ChaosPages'
import { DataModelPage } from '../pages/operations/DataModelPage'
import { PolicyPage } from '../pages/operations/PolicyPage'
import { StageContext, StageDecision, StageEvidence, StageIntervention, StageReceived } from '../pages/system/DuringStages'
import { StageIncidentReceived, StageIntelligenceUpdated, StageRelatedDetected } from '../pages/system/AfterStages'

export function AppRoutes() {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return (
    
    <Routes>
      
      <Route path="/" element={<HubPage />} />

      
      <Route path="/store" element={<StoreLayout />}>
        
        <Route index element={<HomePage />} />
        
        <Route path="catalog" element={<CatalogPage />} />
        
        <Route path="search" element={<SearchPage />} />
        
        <Route path="category/:slug" element={<CategoryPage />} />
        
        <Route path="product/:id" element={<ProductPage />} />
        
        <Route path="seller/:id" element={<SellerPage />} />
        
        <Route path="cart" element={<CartPage />} />
        
        <Route path="order/:orderId/confirmation" element={<OrderConfirmationPage />} />
        
        <Route path="orders" element={<OrdersPage />} />
        
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      
      </Route>

      
      <Route path="/store/checkout" element={<CheckoutLayout />}>
        
        <Route index element={<Navigate to="/store/checkout/delivery" replace />} />
        
        <Route path="delivery" element={<DeliveryPage />} />
        
        <Route path="payment" element={<PaymentPage />} />
        
        <Route path="review" element={<ReviewPage />} />
        
        <Route path="analysis" element={<AnalysisPage />} />
        
        <Route path="verification" element={<CheckoutVerificationPage />} />
        
        <Route path="attention" element={<AttentionPage />} />
        
        <Route path="approved" element={<ApprovedPage />} />
        
        <Route path="interrupted" element={<InterruptedPage />} />
      
      </Route>

      
      <Route path="/security" element={<SecurityLayout />}>
        
        <Route index element={<SecurityHomePage />} />
        
        <Route path="cards" element={<CardsPage />} />
        
        <Route path="transactions" element={<SecurityTransactionsPage />} />
        
        <Route path="transactions/:id" element={<SecurityTransactionDetailPage />} />
        
        <Route path="devices" element={<DevicesPage />} />
        
        <Route path="alerts" element={<AlertsPage />} />
        
        <Route path="protection" element={<ProtectionPage />} />
        
        <Route path="check" element={<CheckPage />} />
        
        <Route path="check/message" element={<MessageCheckPage />} />
        
        <Route path="verification" element={<Navigate to="/security/transactions" replace />} />
        
        <Route path="verification/:id" element={<SecurityVerificationPage />} />
        
        <Route path="verification/:id/done" element={<SecurityConfirmationPage />} />
        
        <Route path="report" element={<ReportIntroPage />} />
        
        <Route path="report/type" element={<ReportTypePage />} />
        
        <Route path="report/transaction" element={<ReportTransactionPage />} />
        
        <Route path="report/description" element={<ReportDescriptionPage />} />
        
        <Route path="report/review" element={<ReportReviewPage />} />
        
        <Route path="report/done" element={<ReportDonePage />} />
        
        <Route path="incidents" element={<Navigate to="/security/report" replace />} />
        
        <Route path="incidents/:id" element={<IncidentFollowPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      
      </Route>

      
      <Route path="/operations" element={<OperationsLayout />}>
        
        <Route index element={<OverviewPage />} />
        
        <Route path="transactions" element={<OpsTransactionsPage />} />
        
        <Route path="transactions/:id" element={<OpsTransactionDetailPage />} />
        
        <Route path="incidents" element={<OpsIncidentsPage />} />
        
        <Route path="incidents/:id" element={<OpsIncidentDetailPage />} />
        
        <Route path="evidence" element={<EvidencePage />} />
        
        <Route path="timeline" element={<TimelinePage />} />
        
        <Route path="intelligence" element={<IntelligencePage />} />
        
        <Route path="intelligence/pattern/:id" element={<PatternDetailPage />} />
        
        <Route path="intelligence/:entityId" element={<RelationshipDetailPage />} />
        
        <Route path="fragility" element={<FragilityPage />} />
        
        <Route path="fragility/:id" element={<FragilityPage />} />
        
        <Route path="independence" element={<IndependencePage />} />
        
        <Route path="independence/:id" element={<IndependencePage />} />
        
        <Route path="chaos" element={<ChaosLabPage />} />
        
        <Route path="chaos/:id" element={<ChaosScenarioPage />} />
        
        <Route path="audit" element={<AuditPage />} />
        
        <Route path="architecture" element={<ArchitecturePage />} />
        
        <Route path="model" element={<DataModelPage />} />
        
        <Route path="policy" element={<PolicyPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      
      </Route>

      
      <Route path="/system" element={<SystemLayout />}>
        
        <Route index element={<Navigate to="/system/received" replace />} />
        
        <Route path="received" element={<StageReceived />} />
        
        <Route path="context" element={<StageContext />} />
        
        <Route path="evidence" element={<StageEvidence />} />
        
        <Route path="decision" element={<StageDecision />} />
        
        <Route path="intervention" element={<StageIntervention />} />
        
        <Route path="incident-received" element={<StageIncidentReceived />} />
        
        <Route path="intelligence-updated" element={<StageIntelligenceUpdated />} />
        
        <Route path="related-detected" element={<StageRelatedDetected />} />
        
        <Route path="*" element={<Navigate to="/system/received" replace />} />
      
      </Route>

      
      <Route path="*" element={<NotFoundPage />} />
    
    </Routes>
  )
}
