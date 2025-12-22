// ============================================
// Bug Fixes Tests
// ============================================
// Tests to verify bug fixes work correctly, specifically for issues that don't require timestamp

#[test_only]
module holdemgame::bug_fixes_tests {
    use std::signer;
    use holdemgame::texas_holdem;
    use holdemgame::chips;

    // ============================================
    // BUG #6: CONFIG VALIDATION TESTS
    // ============================================

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 27, location = holdemgame::texas_holdem)] // E_ZERO_VALUE
    fun test_create_table_zero_small_blind_fails(admin: &signer) {
        chips::init_for_test(admin);
        // small_blind = 0 should fail
        texas_holdem::create_table(admin, 0, 10, 50, 1000, signer::address_of(admin), 0, false);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 25, location = holdemgame::texas_holdem)] // E_INVALID_BLINDS
    fun test_create_table_equal_blinds_fails(admin: &signer) {
        chips::init_for_test(admin);
        // big_blind == small_blind should fail (big must be > small)
        texas_holdem::create_table(admin, 10, 10, 50, 1000, signer::address_of(admin), 0, false);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 25, location = holdemgame::texas_holdem)] // E_INVALID_BLINDS
    fun test_create_table_small_blind_greater_than_big_fails(admin: &signer) {
        chips::init_for_test(admin);
        // small_blind > big_blind should fail
        texas_holdem::create_table(admin, 20, 10, 50, 1000, signer::address_of(admin), 0, false);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 27, location = holdemgame::texas_holdem)] // E_ZERO_VALUE
    fun test_create_table_zero_min_buyin_fails(admin: &signer) {
        chips::init_for_test(admin);
        // min_buy_in = 0 should fail
        texas_holdem::create_table(admin, 5, 10, 0, 1000, signer::address_of(admin), 0, false);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 26, location = holdemgame::texas_holdem)] // E_INVALID_BUY_IN
    fun test_create_table_max_less_than_min_buyin_fails(admin: &signer) {
        chips::init_for_test(admin);
        // max_buy_in < min_buy_in should fail
        texas_holdem::create_table(admin, 5, 10, 1000, 500, signer::address_of(admin), 0, false);
    }

    #[test(admin = @holdemgame)]
    fun test_create_table_valid_config_succeeds(admin: &signer) {
        chips::init_for_test(admin);
        // Valid config should succeed
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        let (small, big, min_buy, max_buy) = texas_holdem::get_table_config(signer::address_of(admin));
        assert!(small == 5, 1);
        assert!(big == 10, 2);
        assert!(min_buy == 50, 3);
        assert!(max_buy == 1000, 4);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 25, location = holdemgame::texas_holdem)] // E_INVALID_BLINDS
    fun test_update_blinds_invalid_fails(admin: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        // Try to update to invalid blinds (small >= big)
        texas_holdem::update_blinds(admin, signer::address_of(admin), 20, 10);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 27, location = holdemgame::texas_holdem)] // E_ZERO_VALUE
    fun test_update_blinds_zero_fails(admin: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        // Try to update to zero small blind
        texas_holdem::update_blinds(admin, signer::address_of(admin), 0, 10);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 26, location = holdemgame::texas_holdem)] // E_INVALID_BUY_IN
    fun test_update_buyin_invalid_fails(admin: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        // Try to update to invalid buy-in (max < min)
        texas_holdem::update_buy_in_limits(admin, signer::address_of(admin), 1000, 500);
    }

    #[test(admin = @holdemgame)]
    #[expected_failure(abort_code = 27, location = holdemgame::texas_holdem)] // E_ZERO_VALUE
    fun test_update_buyin_zero_fails(admin: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        // Try to update to zero min buy-in
        texas_holdem::update_buy_in_limits(admin, signer::address_of(admin), 0, 500);
    }

    // ============================================
    // BUG #7: MISSED BLINDS TRACKING TESTS
    // ============================================

    #[test(admin = @holdemgame, player = @0xBEEF)]
    fun test_sit_out_records_missed_blind(admin: &signer, player: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        let player_addr = signer::address_of(player);
        chips::mint_test_chips(player_addr, 500);
        texas_holdem::join_table(player, signer::address_of(admin), 0, 200);
        
        // Sit out should record missed blind
        texas_holdem::sit_out(player, signer::address_of(admin));
        
        // Check missed blinds recorded (should be big blind = 10)
        let missed = texas_holdem::get_missed_blinds(signer::address_of(admin));
        assert!(*std::vector::borrow(&missed, 0) == 10, 1);
    }

    #[test(admin = @holdemgame, player = @0xBEEF)]
    fun test_sit_in_collects_missed_blind(admin: &signer, player: &signer) {
        chips::init_for_test(admin);
        texas_holdem::create_table(admin, 5, 10, 50, 1000, signer::address_of(admin), 0, false);
        
        let admin_addr = signer::address_of(admin);
        let player_addr = signer::address_of(player);
        chips::mint_test_chips(player_addr, 500);
        texas_holdem::join_table(player, admin_addr, 0, 200);
        
        // Sit out (records missed blind)
        texas_holdem::sit_out(player, admin_addr);
        
        // Check stack before sit_in
        let (_, chips_before, _) = texas_holdem::get_seat_info(admin_addr, 0);
        assert!(chips_before == 200, 1);
        
        // Sit in (should collect missed blind)
        texas_holdem::sit_in(player, admin_addr);
        
        // Check stack after sit_in (should be reduced by big blind)
        let (_, chips_after, _) = texas_holdem::get_seat_info(admin_addr, 0);
        assert!(chips_after == 190, 2); // 200 - 10 (big blind)
        
        // Missed blinds should be cleared
        let missed = texas_holdem::get_missed_blinds(admin_addr);
        assert!(*std::vector::borrow(&missed, 0) == 0, 3);
    }
}
