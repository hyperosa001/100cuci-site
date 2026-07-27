<?php
/**
 * Plugin Name: 100CUCI Site Links
 * Description: REST API for Login / Register URLs used by 100cuci.ad (Next.js).
 * Version: 1.0.0
 * Author: 100CUCI
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CUCI_SITE_LINKS_OPTION', 'cuci_site_links');

function cuci_site_links_defaults() {
    return array(
        'login_url'    => '',
        'register_url' => '',
    );
}

function cuci_site_links_get() {
    $saved = get_option(CUCI_SITE_LINKS_OPTION, array());
    return wp_parse_args($saved, cuci_site_links_defaults());
}

add_action('admin_menu', function () {
    add_options_page(
        '100CUCI Site Links',
        '100CUCI Site Links',
        'manage_options',
        '100cuci-site-links',
        'cuci_site_links_admin_page'
    );
});

add_action('admin_init', function () {
    register_setting('cuci_site_links_group', CUCI_SITE_LINKS_OPTION, array(
        'type'              => 'array',
        'sanitize_callback' => 'cuci_site_links_sanitize',
        'default'           => cuci_site_links_defaults(),
    ));
});

function cuci_site_links_sanitize($input) {
    return array(
        'login_url'    => esc_url_raw($input['login_url'] ?? ''),
        'register_url' => esc_url_raw($input['register_url'] ?? ''),
    );
}

function cuci_site_links_admin_page() {
    $links = cuci_site_links_get();
    ?>
    <div class="wrap">
        <h1>100CUCI Site Links</h1>
        <p>Login / Register 链接会由前台 <strong>100cuci.ad</strong> 通过 REST 拉取（约 60 秒内生效）。留空则前台继续用默认链接。</p>
        <form method="post" action="options.php">
            <?php settings_fields('cuci_site_links_group'); ?>
            <table class="form-table">
                <tr>
                    <th><label for="login_url">Login URL (https)</label></th>
                    <td><input type="url" id="login_url" name="<?php echo esc_attr(CUCI_SITE_LINKS_OPTION); ?>[login_url]" value="<?php echo esc_attr($links['login_url']); ?>" class="regular-text" placeholder="https://..." /></td>
                </tr>
                <tr>
                    <th><label for="register_url">Register URL (https)</label></th>
                    <td><input type="url" id="register_url" name="<?php echo esc_attr(CUCI_SITE_LINKS_OPTION); ?>[register_url]" value="<?php echo esc_attr($links['register_url']); ?>" class="regular-text" placeholder="https://..." /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

add_action('rest_api_init', function () {
    register_rest_route('cuci/v1', '/site-links', array(
        'methods'             => 'GET',
        'callback'            => function () {
            $links = cuci_site_links_get();
            return rest_ensure_response(array(
                'login_url'    => $links['login_url'],
                'register_url' => $links['register_url'],
            ));
        },
        'permission_callback' => '__return_true',
    ));
});
