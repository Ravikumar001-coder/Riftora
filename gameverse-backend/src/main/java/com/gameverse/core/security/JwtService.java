package com.gameverse.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret:default_secret_key_which_must_be_at_least_32_bytes_long}")
    private String secretKey;

    @Value("${jwt.access-token.expiration:900000}") // 15 mins default
    private long jwtExpiration;

    @Value("${jwt.refresh-token.expiration:2592000000}") // 30 days default
    private long refreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(String userId, String username) {
        return generateToken(new HashMap<>(), userId, username);
    }

    public String generateToken(Map<String, Object> extraClaims, String userId, String username) {
        return buildToken(extraClaims, userId, username, jwtExpiration);
    }

    public String generateRefreshToken(String userId, String username) {
        return buildToken(new HashMap<>(), userId, username, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, String userId, String username, long expiration) {
        extraClaims.put("userId", userId);
        return Jwts.builder()
                .claims(extraClaims)
                .subject(username != null ? username : userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
