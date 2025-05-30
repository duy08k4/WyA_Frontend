package ionic.wyafrontend;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebSettings settings = this.getBridge().getWebView().getSettings();
        settings.setTextZoom(100);
}

}
