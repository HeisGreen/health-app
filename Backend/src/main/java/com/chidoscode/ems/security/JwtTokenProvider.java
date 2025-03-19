package com.chidoscode.ems.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration}")
    private Long jwtExpirationDate;

    // Generate JWT token
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + jwtExpirationDate);

        return Jwts.builder()
                .setSubject(username) // Set the subject (username)
                .setIssuedAt(currentDate) // Set the issued at time (current time)
                .setExpiration(expiryDate) // Set the expiration time
                .signWith(key()) // Sign the token with the key
                .compact();
    }


    // Get the signing key
    private Key key() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Get username from JWT token
    public String getUsername(String token) {

        token = token.replace("Bearer ", "");

        Claims claims = Jwts.parser()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token); // Validate the token
            return true; // Token is valid
        } catch (ExpiredJwtException ex) {
            // Token has expired
            System.out.println("Token has expired: " + ex.getMessage());
            return false;
        } catch (SecurityException | MalformedJwtException ex) {
            // Invalid token signature or structure
            System.out.println("Invalid JWT token: " + ex.getMessage());
            return false;
        } catch (IllegalArgumentException ex) {
            // Token is empty or null
            System.out.println("JWT token is empty or null: " + ex.getMessage());
            return false;
        }
    }
}